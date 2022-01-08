import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs';

import { SubstrateService } from 'src/app/services/substrate.service';

// TODO don't call it account?
// TODO reuse account contract?
interface Account {
  address: string,
  name: string;
}

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.sass']
})
export class AccountSelectorComponent implements OnInit {

  public accounts: Account[] = [];

  public selectedAddress: string = '';

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    this.substrateService.state
      .pipe(
        filter(state => state.apiState === 'READY' && state.api && state.keyring?.getPairs),
        take(1)
      )
      .subscribe((state) => {
        const { keyring } = state;

        // Get the list of accounts we possess the private key for
        this.accounts = keyring.getPairs().map((account: any) => ({
          address: account.address,
          name: account.meta.name.toUpperCase()
        }));

        this.selectedAddress = this.accounts[0]?.address ?? '';
      })
  }
}
