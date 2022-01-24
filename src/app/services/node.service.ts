import { Injectable } from '@angular/core';
import { ApiRx, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';
import {
    BehaviorSubject,
    filter,
    from,
    map,
    Observable,
    Subscription,
    switchMap,
    throwError
} from 'rxjs';

import { NodeState } from '../contracts/node-state';
import { environment } from 'src/environments/environment';
import { Account } from '../data-contracts/account';

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    private readonly _nodeState$ = new BehaviorSubject<NodeState | null>(null);

    private connectionSubscription: Subscription | null = null;

    private selectedAccount: Account | null = null;

    public get nodeState$(): Observable<NodeState> {
        if (!this._nodeState$) {
            return throwError(() => 'Node is not connected');
        }

        return this._nodeState$.pipe(filter(f => !!f), map((m) => m!));
    };

    public connectToNode(): Observable<NodeState> {
        if (this.connectionSubscription != null) {
            console.error('Attmpted to initialize node multiple times.');
        }

        this.connectionSubscription ??= this.createApiObservable()
            .subscribe({
                next: api => this.loadAccountsIfReady(api),
                error: console.error,
            });

        return this.nodeState$;
    }

    private createApiObservable(): Observable<ApiRx> {
        const provider = new WsProvider(environment.providerSocket);
        const rpc = { ...jsonrpc, ...environment.rpc };

        return ApiRx.create({ provider, rpc });
    }

    private loadAccountsIfReady(api: ApiRx) {
        if (api.isConnected && api.isReady) {
            this.loadAccounts(api);
        }
    }

    private loadAccounts(api: ApiRx) {
        from(web3Enable(environment.appName))
            .pipe(switchMap(ext => from(web3Accounts())))
            .subscribe({
                next: accounts => {
                    const socket = environment.providerSocket;
                    this.loadKeyring(accounts);
                    this._nodeState$.next({ api, keyring, socket });
                },
                error: console.error
            });
    }

    private loadKeyring(accounts: InjectedAccountWithMeta[]) {
        const mappedAccounts = accounts.map(({ address, meta }) => ({
            address,
            meta: {
                ...meta,
                name: `${meta.name} (${meta.source})`
            }
        }));

        keyring.loadAll({
            isDevelopment: environment.developmentKeyring
        }, mappedAccounts);
    }

    public selectAccount(account: Account) {
        this.selectedAccount = account;
    }

    // todo polkadot.js extension transfers?
    public transfer(amount: number, toAddress: string): Observable<string> {
        if (this._nodeState$.value == null) {
            return throwError(() => 'Node state is not initialized')
        }

        if (this.selectedAccount == null) {
            return throwError(() => 'No account is selected');
        }

        const { api, keyring } = this._nodeState$.value;

        if (keyring == null) {
            return throwError(() => 'Keyring is null');
        }

        const keyPair = keyring.getPair(this.selectedAccount.address);

        const observable = new Observable<string>((subscriber) => {
            api.tx.balances
                .transfer(toAddress, amount)
                .signAndSend(keyPair)
                .subscribe({
                    next: result => {
                        if (result.status.isFinalized) {
                            subscriber.next(`😉 Finalized. Block hash: ` +
                                `${result.status.asFinalized.toString()}`);

                            subscriber.complete();
                        } else {
                            subscriber.next(`Current transaction status: ` +
                                `${result.status.type}`);
                        }
                    },
                    error: error => {
                        console.error(error);
                        subscriber.error(`😞 Transaction Failed: ` +
                            `${error.toString()}`)
                    }
                });
        })

        return observable;
    }
}
