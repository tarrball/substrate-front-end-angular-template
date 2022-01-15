import { Injectable } from '@angular/core';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';

import { NodeState } from '../contracts/node-state';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Account } from '../data-contracts/account';

// todo this service needs a lot of cleanup love
@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private loadAccts = false;

  // todo public state obviously not a good idea, but
  // proof of concept
  public state$ = new BehaviorSubject<NodeState>({
    socket: environment.providerSocket,
    jsonrpc: { ...jsonrpc, ...environment.rpc },
    keyring: null,
    keyringState: null,
    api: null,
    apiError: null,
    apiState: null
  });

  private _selectedAccount$ = new BehaviorSubject<Account | null>(null);

  public get selectedAccount$(): Observable<Account | null> { return this._selectedAccount$.asObservable() };

  // should only be callable once
  public initialize(): Observable<NodeState> {
    this.connectToNode();
    this.loadAccounts();

    return this.state$.asObservable();
  }

  private connectToNode() {
    const { apiState, socket, jsonrpc } = this.state$.value;

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

    api.on('ready', () => this.updateState({ type: 'CONNECT_SUCCESS' }));
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

    const { keyringState } = this.state$.value;
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
    const newState = this.reducer(this.state$.value, action);
    this.state$.next(newState);
  }

  private reducer(state: NodeState, action: any) {
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
}
