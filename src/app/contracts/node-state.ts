import { ApiPromise, Keyring } from "@polkadot/api";

interface BaseNodeState {
    apiError: any,
    apiState: any,
    jsonrpc: any,
    keyringState: any,
    socket: string
}

export interface InitializedNodeState extends BaseNodeState {
    api: ApiPromise,
    keyring: Keyring
}

export interface PartialNodeState extends BaseNodeState {
    api: ApiPromise | null,
    keyring: Keyring | null,
}