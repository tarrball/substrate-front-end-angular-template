import { ApiRx } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring';

export class NodeState {
    constructor(public api: ApiRx,
        public keyring: Keyring,
        public socket: string) { }
}