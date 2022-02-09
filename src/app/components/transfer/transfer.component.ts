import { FormBuilder, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.sass']
})
export class TransferComponent {
    public transferForm = this.fb.group({
        toAddress: ['', Validators.required],
        amount: ['', [Validators.min(1), Validators.required]]
    });

    public transferStatus = '';

    constructor(private nodeService: NodeService, private fb: FormBuilder) { }

    public submit() {
        if (!this.transferForm.valid) {
            return;
        }

        const amount = this.transferForm.get('amount')!.value;
        const toAddress = this.transferForm.get('toAddress')!.value;

        this.nodeService
            .transfer(amount, toAddress)
            .subscribe({
                next: (status) => this.updateStatus(status),
                error: (error) => this.updateStatus(error)
            });
    }

    private updateStatus(status: string) {
        this.transferStatus = status;
    }
}
