import { Injectable } from '@angular/core';

// TODO polkadot service
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';

import { SubstrateState } from '../contracts/substrate-state';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubstrateService {

  private loadAccts = false;

  // todo public state obviously not a good idea, but
  // proof of concept
  public state = new BehaviorSubject<SubstrateState>({
    socket: environment.providerSocket,
    jsonrpc: { ...jsonrpc, ...environment.rpc },
    keyring: null,
    keyringState: null,
    api: null,
    apiError: null,
    apiState: null
  });

  public connectToNode() {
    const { apiState, socket, jsonrpc } = this.state.value;

    // We only want this function to be performed once
    if (apiState) {
      return;
    }

    this.updateState({ type: 'CONNECT_INIT' });

    const provider = new WsProvider(socket);
    const _api = new ApiPromise({ provider, rpc: jsonrpc });

    // Set listeners for disconnection and reconnection event.
    _api.on('connected', () => {
      this.updateState({ type: 'CONNECT', payload: _api });

      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      _api.isReady.then((_api) => {
        this.updateState({ type: 'CONNECT_SUCCESS' });
      });
    });

    _api.on('ready', () => this.updateState({ type: 'CONNECT_SUCCESS' }));
    _api.on('error', err => this.updateState({ type: 'CONNECT_ERROR', payload: err }));
  }

  public loadAccounts() {
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

    const { keyringState } = this.state.value;
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
    const newState = this.reducer(this.state.value, action);
    this.state.next(newState);
  }

  private reducer(state: SubstrateState, action: any) {
    console.log('-------------------------');
    console.log('reducer state:');
    console.log(state);
    console.log('-------------------------');

    console.log('reducer action:');
    console.log(action);
    console.log('-------------------------');

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
}
