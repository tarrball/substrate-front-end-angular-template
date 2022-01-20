import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import { EMPTY, filter, map, Observable, startWith, take } from 'rxjs';

import { Account } from 'src/app/data-contracts/account';
import { NodeService } from 'src/app/services/node.service';

// TODO still needs the "no account selected functionality"
@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.sass']
})
export class AccountSelectorComponent implements OnInit {

  public accountControl = new FormControl();

  public accounts: Account[] = [];

  public selectedAccount?: Account;

  public selectedAccountBalance?: string;

  public filteredAccounts: Observable<Account[]> = EMPTY;

  constructor(private nodeService: NodeService) { }

  public ngOnInit(): void {
    this.nodeService.state$
      .pipe(
        filter(state => state?.apiState === 'READY' && state.api != null && state.keyring != null),
        take(1)
      )
      .subscribe((state) => {
        // TODO this is basically copy/paste of balances component
        const { api, keyring } = state!;

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
              new Account(
                address,
                balances[index].data.free.toHuman(),
                (accounts[index].meta as any).name.toUpperCase()));

            // this could be a testable function..
            this.filteredAccounts = this.accountControl.valueChanges.pipe(
              startWith(''),
              map((value: string | Account) => typeof value === 'string'
                ? value
                : value.name),
              map((name: string) => name
                ? this.filter(name)
                : this.accounts.slice())
            );

            if (this.accounts[0]) {
              this.accountControl.setValue(this.accounts[0]);
              this.selectAccount(this.accounts[0]);
            }
          })
          .catch(console.error);
      })
  }

  public displayName(account: Account): string {
    return account?.name ?? '';
  }

  public selectAccount(account: Account) {
    this.nodeService.selectAccount(account);
    this.selectedAccount = account;

    const { api } = this.nodeService.state$.value!; // todo how can we get value without having to ! bang everywhere?

    // duplicated error handling
    if (api == null) {
      throw 'api is null';
    }

    // TODO error handling?
    // TODO hide more in substrate service?
    api.query.system.account(this.selectedAccount?.address, (balance: any) => {
      this.selectedAccountBalance = balance.data.free.toHuman();
    });
  }

  private filter(value: string): Account[] {
    const filterValue = value.toLowerCase();

    return this.accounts
      .filter(account => account.name.toLowerCase().includes(filterValue));
  }

  public clear(event: Event, trigger: MatAutocompleteTrigger) {
    this.accountControl.setValue('');
    event.stopPropagation();
    trigger.openPanel();
  }
}
