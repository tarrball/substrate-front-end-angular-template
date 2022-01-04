import { Injectable } from '@angular/core';

// TODO polkadot service
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';

import { SubstrateState } from '../contracts/substrate-state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubstrateService {

  private loadAccts = false;
  
  private state: SubstrateState = {
    socket: environment.providerSocket,
    jsonrpc: { ...jsonrpc, ...environment.rpc },
    keyring: null,
    keyringState: null,
    api: null,
    apiError: null,
    apiState: null
  };

  public connectToNode() {
    const { apiState, socket, jsonrpc } = this.state;

    // We only want this function to be performed once
    if (apiState) {
      return;
    }

    this.state = this.reducer(this.state, { type: 'CONNECT_INIT' });

    const provider = new WsProvider(socket);
    const _api = new ApiPromise({ provider, rpc: jsonrpc });

    // Set listeners for disconnection and reconnection event.
    _api.on('connected', () => {
      this.state = this.reducer(this.state, { type: 'CONNECT', payload: _api });

      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      _api.isReady.then((_api) => {
        this.reducer(this.state, { type: 'CONNECT_SUCCESS' });
      });
    });

    _api.on('ready', () => this.reducer(this.state, { type: 'CONNECT_SUCCESS' }));
    _api.on('error', err => this.reducer(this.state, { type: 'CONNECT_ERROR', payload: err }));
  }

  public loadAccounts() {
    const asyncLoadAccounts = async () => {
      this.reducer(this.state, { type: 'LOAD_KEYRING' });

      try {
        await web3Enable(environment.appName);
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) =>
          ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
        keyring.loadAll({ isDevelopment: environment.developmentKeyring }, allAccounts);

        this.reducer(this.state, { type: 'SET_KEYRING', payload: keyring });
      } catch (e) {
        console.error(e);
        this.reducer(this.state, { type: 'KEYRING_ERROR' });
      }
    };

    const { keyringState } = this.state;
    // If `keyringState` is not null `asyncLoadAccounts` is running.
    if (keyringState) {
      return;
    }

    // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
    if (this.loadAccts) {
      this.reducer(this.state, { type: 'SET_KEYRING', payload: keyring });
    }

    // This is the heavy duty work
    this.loadAccts = true;
    asyncLoadAccounts();
  }

  private reducer(state: any, action: any) {
    console.log('-------------------------');
    console.log('reducer state:');
    console.log(state);
    console.log('-------------------------');

    console.log('reducer action:');
    console.log(action);
    console.log('-------------------------');


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
