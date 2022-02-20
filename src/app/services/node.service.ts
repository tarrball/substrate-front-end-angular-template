import { ApiRx, WsProvider } from '@polkadot/api';
import { BehaviorSubject, Observable, Subscription, filter, from, map, switchMap, throwError } from 'rxjs';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

import { Account } from '../data-contracts/account';
import { Injectable } from '@angular/core';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { KeyringPair } from '@polkadot/keyring/types';
import { NodeState } from '../data-contracts/node-state';
import { environment } from 'src/environments/environment';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';

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

        if (this.selectedAccount == null) {
            return throwError(() => NO_ACCOUNT_SELECTED_MESSAGE);
        }

        const { api, keyring } = this._nodeState$.value;
        const keyPair = keyring.getPair(this.selectedAccount.address);

        const observable = new Observable<string>((subscriber) => {
            api.tx['balances']['transfer'](toAddress, amount)
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
