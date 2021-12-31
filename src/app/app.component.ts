import { Component, OnInit } from '@angular/core';

// TODO polkadot service
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { keyring } from '@polkadot/ui-keyring';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public title = 'substrate-angular-template';

  public ngOnInit() {
    console.log(`Connect socket: ${environment.providerSocket}`);

    const initialState: State = {
      socket: environment.providerSocket,
      jsonrpc: { ...jsonrpc, ...environment.rpc },
      keyring: null,
      keyringState: null,
      api: null,
      apiError: null,
      apiState: null
    };

    this.loadAccounts(initialState, this.reducer);
  }

  private connectToNode(state: any, dispatch: any) {
  }

  loadAccts = false;
  private loadAccounts(state: any, dispatch: any) {
    const asyncLoadAccounts = async () => {
      dispatch({ type: 'LOAD_KEYRING' });
      try {
        await web3Enable(environment.appName);
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) =>
          ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
        keyring.loadAll({ isDevelopment: environment.developmentKeyring }, allAccounts);
        dispatch({ type: 'SET_KEYRING', payload: keyring });
      } catch (e) {
        console.error(e);
        dispatch({ type: 'KEYRING_ERROR' });
      }
    };

    const { keyringState } = state;
    // If `keyringState` is not null `asyncLoadAccounts` is running.
    if (keyringState) return;
    // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
    if (this.loadAccts) return dispatch({ type: 'SET_KEYRING', payload: keyring });

    // This is the heavy duty work
    this.loadAccts = true;
    asyncLoadAccounts();
  }

  private reducer(state: any, action: any) {
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

enum ReducerType {
  ConnectInit,
  Connect,
  ConnectStress,
  ConnectError,
  LoadKeyring,
  SetKeyring,
  KeyringError,
}

interface State {
  socket: string,
  jsonrpc: any,
  keyring: any,
  keyringState: any,
  api: any,
  apiError: any,
  apiState: any,
}