import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { KeyringPair } from '@polkadot/keyring/types';

export class Account {
    public balance: string;

    public name: string;

    public constructor(
        public address: string,
        accountInfo: FrameSystemAccountInfo,
        keypair: KeyringPair
    ) {
        this.balance = accountInfo.data.free.toHuman();
        this.name = (keypair.meta as any).name.toUpperCase();
    }
}