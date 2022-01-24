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
        this.nodeService.nodeState$
            .subscribe((state) => {
                const { api, keyring } = state
                const accounts = keyring.getPairs();
                const addresses = accounts
                    .map((account: { address: string }) => account.address);

                api.query.system.account
                    .multi(addresses).subscribe({
                        next: (balances) => {
                            this.accounts = addresses
                                .map((address: string, index: number) =>
                                    new Account(
                                        address,
                                        balances[index].data.free.toHuman(),
                                        (accounts[index].meta as any).name
                                            .toUpperCase()));

                            this.filteredAccounts = this.accountControl
                                .valueChanges.pipe(
                                    startWith(''),
                                    map((value: string | Account) =>
                                        typeof value === 'string'
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
                        },
                        error: console.error
                    });
            })
    }

    public displayName(account: Account): string {
        return account?.name ?? '';
    }

    public selectAccount(account: Account) {
        this.nodeService.selectAccount(account);
        this.selectedAccount = account;
    }

    private filter(value: string): Account[] {
        const filterValue = value.toLowerCase();

        return this.accounts
            .filter(account => account.name
                .toLowerCase()
                .includes(filterValue));
    }

    public clear(event: Event, trigger: MatAutocompleteTrigger) {
        this.accountControl.setValue('');
        event.stopPropagation();
        trigger.openPanel();
    }
}
