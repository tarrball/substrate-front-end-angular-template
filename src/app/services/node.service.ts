import { Injectable } from '@angular/core';
import { ApiRx, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';
import { BehaviorSubject, filter, map, Observable, throwError } from 'rxjs';

import { NodeState } from '../contracts/node-state';
import { environment } from 'src/environments/environment';
import { Account } from '../data-contracts/account';

// todo this service needs a lot of cleanup love
@Injectable({
    providedIn: 'root'
})
export class NodeService {

    private loadAccts = false;

    private _nodeState$ = new BehaviorSubject<NodeState | null>(null);

    private selectedAccount: Account | null = null;

    public get nodeState$(): Observable<NodeState> {
        return this._nodeState$.pipe(filter(f => !!f), map((m) => m!));
    };

    // TODO should only be callable once
    public initialize(): Observable<NodeState | null> {
        this.connectToNode();

        return this.nodeState$;
    }

    // TODO sometimes (refresh a bunch of times) I get API/INIT: Error: 
    // FATAL: Unable to initialize the API: undefined...timing issues?
    private connectToNode() {
        // TODO this should be sub, not state
        if (this._nodeState$.value) {
            throw 'Node is already connected';
        }

        const provider = new WsProvider(environment.providerSocket);
        const rpc = { ...jsonrpc, ...environment.rpc };

        // todo keep subscription alive and don't let it recreated
        ApiRx.create({ provider, rpc }).subscribe({
            next: api => {
                // todo give this a function handler                 
                if (api.isConnected && !api.isReady) {
                    console.log('Connected!');
                }

                if (api.isConnected && api.isReady) {
                    console.log('Is Ready!');

                    this._nodeState$.next({
                        api,
                        keyring: null,
                        keyringState: null,
                        socket: environment.providerSocket
                    });

                    this.loadAccounts();
                }

                // else block console log
            },
            // todo give this a function handler
            error: error => console.log(error)
        });
    }

    private loadAccounts() {
        // TODO need to not do this again if it's been called already        
        if (this._nodeState$.value == null) {
            throw 'Node is not connected';
        }

        const asyncLoadAccounts = async () => {
            try {
                await web3Enable(environment.appName);
                let allAccounts = await web3Accounts();

                allAccounts = allAccounts.map(({ address, meta }) => ({
                    address,
                    meta: {
                        ...meta,
                        name: `${meta.name} (${meta.source})`
                    }
                }));

                keyring.loadAll({
                    isDevelopment: environment.developmentKeyring
                }, allAccounts);

                this._nodeState$.next({ ...this._nodeState$.value!, keyring });
            } catch (e) {
                console.error(e);
            }
        };

        // const { keyringState } = this.state$.value;

        // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
        // if (this.loadAccts) {
        //     this.state$.next({ ...this.state$.value, keyring });
        // }

        // This is the heavy duty work
        this.loadAccts = true;
        asyncLoadAccounts();
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
