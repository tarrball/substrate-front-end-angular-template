import { Component, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { filter, take } from 'rxjs';

import { Account } from 'src/app/data-contracts/account';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.sass']
})
export class BalancesComponent implements OnInit {

  public accounts: Account[] = [];

  public displayedColumns = ['name', 'address', 'balance'];

  constructor(private nodeService: NodeService) { }

  public ngOnInit(): void {
    this.nodeService.state$
      .pipe(
        filter(state => state.apiState === 'READY' && state.api != null && state.keyring != null),
        take(1)
      )
      .subscribe((state) => {
        const { api, keyring } = state;

        // checked in filter and also duplicated errors from node service
        if (api == null) {
          throw 'api is null';
        }

        if (keyring == null) {
          throw 'keyring is null';
        }

        const accounts = keyring.getPairs();
        const addresses = accounts.map((account: { address: string }) => account.address);

        api.query.system.account
          .multi(addresses, (balances: FrameSystemAccountInfo[]) => {
            this.accounts = addresses.map((address: string, index: number) =>
              new Account(address, balances[index].data.free.toHuman(), (accounts[index].meta as any).name));
          })
          .catch(console.error);
      });
  }

  public show(tooltip: MatTooltip) {
    tooltip.disabled = false;
    tooltip.show();

    setTimeout(() => {
      tooltip.hide();
      tooltip.disabled = true;
    }, 1000);
  }
}
