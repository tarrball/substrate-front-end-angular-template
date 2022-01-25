import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { EMPTY, map, Observable, startWith } from 'rxjs';

import { Account } from 'src/app/data-contracts/account';
import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-account-selector',
    templateUrl: './account-selector.component.html',
    styleUrls: ['./account-selector.component.sass']
})
export class AccountSelectorComponent implements OnInit {

    public accountControl = new FormControl();

    public accounts: Account[] = [];

    public selectedAccount?: Account;

    public filteredAccounts: Observable<Account[]> = EMPTY;

    constructor(private nodeService: NodeService) { }

    public ngOnInit(): void {
        this.nodeService
            .getAccounts()
            .subscribe({
                next: (accounts) => this.setAccounts(accounts),
                error: console.error
            });
    }

    private setAccounts(accounts: Account[]) {
        this.accounts = accounts;

        this.filteredAccounts = this.filterAccounts(
            this.accountControl.valueChanges);

        this.selectFirstAccount();
    }

    private filterAccounts(controlValueChanges$: Observable<string | Account>) {
        return controlValueChanges$.pipe(
            startWith(''),
            map((value: string | Account) => typeof value === 'string'
                ? value
                : value.name),
            map((name: string) => name
                ? this.accounts
                    .filter(account => account.name
                        .toLowerCase()
                        .includes(name.toLowerCase()))
                : this.accounts.slice()
            ));
    }

    private selectFirstAccount() {
        if (this.accounts.length == 0) {
            return;
        }

        this.accountControl.setValue(this.accounts[0]);
        this.selectAccount(this.accounts[0]);
    }

    public selectAccount(account: Account) {
        this.nodeService.selectAccount(account);
        this.selectedAccount = account;
    }

    public accountDisplayName(account: Account): string {
        return account?.name ?? '';
    }

    public clearAccountSelector(event: Event, trigger: MatAutocompleteTrigger) {
        this.accountControl.setValue('');
        event.stopPropagation();
        trigger.openPanel();
    }
}
