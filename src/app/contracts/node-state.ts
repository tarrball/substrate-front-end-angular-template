import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring';

export interface NodeState {
    api: ApiRx,
    keyring: Keyring | null,
    keyringState: any,
    socket: string
}