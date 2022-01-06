import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { filter, map, take } from 'rxjs';

import { Account } from 'src/app/data-contracts/account';
import { SubstrateService } from 'src/app/services/substrate.service';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.sass']
})
export class BalancesComponent implements OnInit {

  public accounts: Account[] = [];

  public displayedColumns = ['name', 'address', 'balance'];

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    this.substrateService.state
      .pipe(
        filter(state => state.apiState === 'READY' && state.api && state.keyring?.getPairs),
        take(1)
      )
      .subscribe((state) => {
        const { api, keyring } = state;
        const accounts = keyring.getPairs();
        const addresses = accounts.map((account: { address: string }) => account.address);
        const names = accounts.map((account: any) => account.meta.name);

        api.query.system.account
          .multi(addresses, (balances: any) => {
            this.accounts = addresses.map((address: string, index: number) =>
              new Account(address, balances[index].data.free.toHuman(), accounts[index].meta.name));

            console.log(this.accounts);
          })
          .then((unsub: any) => {
            // unsubscribeAll = unsub;
          })
          .catch(console.error);
      });
  }
}
