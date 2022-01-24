import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring';

export interface NodeState {
    api: ApiRx,
    keyring: Keyring
    socket: string
}