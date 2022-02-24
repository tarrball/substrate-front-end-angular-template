import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { Account } from '../data-contracts/account';
import { ApiRx, WsProvider } from '@polkadot/api';
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
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { keyring } from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { NodeState } from '../data-contracts/node-state';
import { TransactionType } from '../shared/enums/transaction-type';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';


const NO_ACCOUNT_SELECTED_MESSAGE = 'No account is selected.';
const NOT_CONNECTED_MESSAGE = 'App is not connected to node.';

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    private readonly _nodeState$ = new BehaviorSubject<NodeState | null>(null);

    private connectionSubscription: Subscription | null = null;

    private selectedAccount: Account | null = null;

    public get nodeState$(): Observable<NodeState> {
        if (!this._nodeState$) {
            return throwError(() => NOT_CONNECTED_MESSAGE);
        }

        return this._nodeState$.pipe(filter(f => !!f), map((m) => m!));
    };

    public connectToNode(): Observable<NodeState> {
        if (this.connectionSubscription != null) {
            return throwError(() =>
                'Attempted to initialize node multiple times.');
        }

        const apiOptions = {
            provider: new WsProvider(environment.providerSocket),
            rpc: { ...jsonrpc, ...environment.rpc }
        };

        this.connectionSubscription = ApiRx
            .create(apiOptions)
            .subscribe({
                next: api => this.loadAccountsIfReady(api),
                error: console.error,
            });

        return this.nodeState$;
    }

    public executeTransaction(
        api: any, // losing the strong typing for results & all with this
        palletRpc: string,
        palletCallable: string,
        palletParams: any[],
        // palletParams: { [key: string]: string },
        type: TransactionType): Observable<string> {

        if (type === TransactionType.Signed) {
            if (this.selectedAccount == null) {
                return throwError(() => NO_ACCOUNT_SELECTED_MESSAGE);
            }

            if (this._nodeState$.value == null) {
                return throwError(() => NOT_CONNECTED_MESSAGE);
            }

            const { keyring } = this._nodeState$.value;
            const keyPair = keyring.getPair(this.selectedAccount.address);

            const observable = new Observable<string>((subscriber) => {
                api[palletRpc][palletCallable](...palletParams)
                    .signAndSend(keyPair)
                    .subscribe({
                        next: (result: ISubmittableResult) => {
                            if (result.status.isFinalized) {
                                subscriber.next(`😉 Finalized. Block hash: ` +
                                    `${result.status.asFinalized.toString()}`);

                                subscriber.complete();
                            } else {
                                subscriber.next(`Current transaction status: ` +
                                    `${result.status.type}`);
                            }
                        },
                        error: (error: Error) => {
                            console.error(error);
                            subscriber.error(`😞 Transaction Failed: ` +
                                `${error.toString()}`)
                        }
                    });
            })

            return observable;
        }

        return throwError(() => 'This feature is not yet implemented!');
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

    public getAccounts(): Observable<Account[]> {
        if (!this._nodeState$ || this._nodeState$.value == null) {
            return throwError(() => NOT_CONNECTED_MESSAGE);
        }

        const { api, keyring } = this._nodeState$.value
        const keypairs = keyring.getPairs();
        const addresses = this.getAddresses(keypairs);

        return api.query['system']['account']
            .multi(addresses)
            .pipe(map((accounts) =>
                addresses.map((address, i) => new Account(
                    address,
                    accounts[i],
                    keypairs[i]
                ))
            ))
    }

    private getAddresses(keyringPairs: KeyringPair[]): string[] {
        return keyringPairs.map((account: { address: string }) =>
            account.address);
    }

    public selectAccount(account: Account) {
        this.selectedAccount = account;
    }

    public transfer(amount: number, toAddress: string): Observable<string> {
        if (this._nodeState$.value == null) {
            return throwError(() => NOT_CONNECTED_MESSAGE);
        }

        return this.executeTransaction(
            this._nodeState$.value.api.tx,
            'balances',
            'transfer',
            [toAddress, amount],
            TransactionType.Signed
        );
    }
}
