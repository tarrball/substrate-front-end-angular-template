import { Component, OnInit } from '@angular/core';

import { Account } from 'src/app/data-contracts/account';
import { MatTooltip } from '@angular/material/tooltip';
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
        this.nodeService
            .getAccounts()
            .subscribe({
                next: (accounts) => this.accounts = accounts,
                error: console.error
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
