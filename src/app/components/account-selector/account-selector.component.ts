import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EMPTY, filter, map, Observable, startWith, take } from 'rxjs';

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

  public accountControl = new FormControl();

  public accounts: Account[] = [];

  public selectedAccount?: Account;

  public selectedAccountBalance?: string;

  public filteredAccounts: Observable<Account[]> = EMPTY;

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    this.substrateService.state$
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

        if (this.accounts[0]) {
          this.selectAccount(this.accounts[0]);
        }

        this.filteredAccounts = this.accountControl.valueChanges.pipe(
          startWith(''),
          map((value: string) => this.filter(value))
        );
      })
  }

  // TODO rearrange functions?
  public accountSelected(account: Account) {
    console.log(account);
    // const account = this.accounts.find(f => f.address === event.option.value);

    // if (account) {
    //   this.selectAccount(account);
    // } else {
    //   console.error('Account not found');
    // }
  }

  public displayName(account: Account): string {
    return account.name;
  }

  public selectAccount(account: Account) {
    this.substrateService.selectAccount(account);
    this.selectedAccount = account;

    const { api } = this.substrateService.state$.value;

    // TODO error handling?
    // TODO hide more in substrate service?
    api.query.system.account(this.selectedAccount?.address, (balance: any) => {
      this.selectedAccountBalance = balance.data.free.toHuman();
    });
  }

  // TODO im broken
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
