import { Injectable } from '@angular/core';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';

import { InitializedNodeState, PartialNodeState } from '../contracts/node-state';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from, map, Observable, take, throwError } from 'rxjs';
import { Account } from '../data-contracts/account';

// todo this service needs a lot of cleanup love
@Injectable({
    providedIn: 'root'
})
export class NodeService {

    private loadAccts = false;

    // todo public state obviously not a good idea, but
    // proof of concept
    public state$ = new BehaviorSubject<InitializedNodeState | null>(null);

    private initialState$ = new BehaviorSubject<PartialNodeState>({
        api: null,
        apiError: null,
        apiState: null,
        jsonrpc: { ...jsonrpc, ...environment.rpc },
        keyring: null,
        keyringState: null,
        socket: environment.providerSocket
    });

    private _selectedAccount$ = new BehaviorSubject<Account | null>(null);

    public get selectedAccount$(): Observable<Account | null> { return this._selectedAccount$.asObservable() };

    // should only be callable once
    public initialize(): Observable<InitializedNodeState | null> {
        this.connectToNode();
        this.loadAccounts();

        return this.state$.asObservable();
    }

    // TODO sometimes (refresh a bunch of times) I get API/INIT: Error: FATAL: Unable to initialize the API: undefined...timing issues?
    private connectToNode() {
        const { apiState, socket, jsonrpc } = this.initialState$.value;

        // We only want this function to be performed once
        if (apiState) {
            return;
        }

        this.updateState({ type: 'CONNECT_INIT' });

        const provider = new WsProvider(socket);
        const api = new ApiPromise({ provider, rpc: jsonrpc });

        // Set listeners for disconnection and reconnection event.
        api.on('connected', () => {
            this.updateState({ type: 'CONNECT', payload: api });

            // `ready` event is not emitted upon reconnection and is checked explicitly here.
            api.isReady.then((_api) => {
                this.updateState({ type: 'CONNECT_SUCCESS' });
            });
        });

        api.on('ready', () => {
            const newState = this.reducer(this.initialState$.value, { type: 'CONNECT_SUCCESS' });
            const { api, keyring } = newState;

            if (api == null) {
                throw `Node connected successfully but 'api' was null`;
            }

            if (keyring == null) {
                throw `Node connected successfully bu 'keyring' was null`;
            }

            this.state$.next({ ...newState, api: newState.api!, keyring: newState.keyring! });
        });

        api.on('error', err => this.updateState({ type: 'CONNECT_ERROR', payload: err }));
    }

    private loadAccounts() {
        const asyncLoadAccounts = async () => {
            this.updateState({ type: 'LOAD_KEYRING' });

            try {
                await web3Enable(environment.appName);
                let allAccounts = await web3Accounts();
                allAccounts = allAccounts.map(({ address, meta }) =>
                    ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
                keyring.loadAll({ isDevelopment: environment.developmentKeyring }, allAccounts);

                this.updateState({ type: 'SET_KEYRING', payload: keyring });
            } catch (e) {
                console.error(e);
                this.updateState({ type: 'KEYRING_ERROR' });
            }
        };

        const { keyringState } = this.initialState$.value;
        // If `keyringState` is not null `asyncLoadAccounts` is running.
        if (keyringState) {
            return;
        }

        // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
        if (this.loadAccts) {
            this.updateState({ type: 'SET_KEYRING', payload: keyring });
        }

        // This is the heavy duty work
        this.loadAccts = true;
        asyncLoadAccounts();
    }

    private updateState(action: any) {
        const newState = this.reducer(this.initialState$.value, action);
        this.initialState$.next(newState);
    }

    private reducer(state: PartialNodeState, action: any): PartialNodeState {
    // console.log('-------------------------');
    // console.log('reducer state:');
    // console.log(state);
    // console.log('-------------------------');

        // console.log('reducer action:');
        // console.log(action);
        // console.log('-------------------------');

        // TODO use enum
        switch (action.type) {
        case 'CONNECT_INIT':
            return { ...state, apiState: 'CONNECT_INIT' };

        case 'CONNECT':
            return { ...state, api: action.payload, apiState: 'CONNECTING' };

        case 'CONNECT_SUCCESS':
            return { ...state, apiState: 'READY' };

        case 'CONNECT_ERROR':
            return { ...state, apiState: 'ERROR', apiError: action.payload };

        case 'LOAD_KEYRING':
            return { ...state, keyringState: 'LOADING' };

        case 'SET_KEYRING':
            return { ...state, keyring: action.payload, keyringState: 'READY' };

        case 'KEYRING_ERROR':
            return { ...state, keyring: null, keyringState: 'ERROR' };

        default:
            throw new Error(`Unknown type: ${action.type}`);
        }
    }

    public selectAccount(account: Account) {
        this._selectedAccount$.next(account);
    }

    // todo polkadot.js extension transfers?
    public transfer(amount: number, toAddress: string): Observable<string> {
        if (this.state$.value == null) {
            return throwError(() => 'Node state is not initialized')
        }

        if (this._selectedAccount$.value == null) {
            return throwError(() => 'No account is selected');
        }

        const { api, keyring } = this.state$.value;
        const keyPair = keyring.getPair(this._selectedAccount$.value!.address);

        const observable = new Observable<string>((subscriber) => {
            api.tx.balances
                .transfer(toAddress, amount)
                .signAndSend(keyPair, (result) => {
                    subscriber.next(`Current status is ${result.status}`);

                    if (result.status.isFinalized) {
                        subscriber.next(`😉 Finalized. Block hash: ${result.status.asFinalized.toString()}`);
                        subscriber.complete();
                    } else {
                        subscriber.next(`Current transaction status: ${result.status.type}`);
                    }
                }).catch((error: Error) => {
                    subscriber.error(`😞 Transaction Failed: ${error.toString()}`)
                });
        })

        return observable;
    }
}
