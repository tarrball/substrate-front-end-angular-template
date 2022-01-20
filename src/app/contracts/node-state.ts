import { ApiPromise, Keyring } from "@polkadot/api";

export interface NodeState {
    api: ApiPromise | null,
    apiError: any,
    apiState: any,
    jsonrpc: any,
    keyring: Keyring | null,
    keyringState: any,
    socket: string
}