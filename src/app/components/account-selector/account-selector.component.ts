import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
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

  // @ViewChild('autoCompleteTrigger') public autoCompleteTrigger!: MatAutocompleteTrigger;

  public accountControl = new FormControl();

  public accounts: Account[] = [];

  public selectedAddress = '';

  public filteredAccounts: Observable<string[]> = EMPTY;

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

        this.filteredAccounts = this.accountControl.valueChanges.pipe(
          startWith(''),
          map((value: string) => this.filter(value))
        );
      })
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accounts
      .filter(option => option.name.toLowerCase().includes(filterValue))
      .map(account => account.name);
  }

  public clear(event: Event, trigger: MatAutocompleteTrigger) {
    this.accountControl.setValue('');
    event.stopPropagation();
    trigger.openPanel();
  }
}
