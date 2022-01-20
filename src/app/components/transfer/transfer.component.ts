import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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

  // TODO test me
  public submit() {
    if (this.transferForm.valid) {
      const amount = this.transferForm.get('amount')!.value;
      const toAddress = this.transferForm.get('toAddress')!.value;

      // TODO unsub?
      this.nodeService.transfer(amount, toAddress).subscribe({
        next: result => this.transferStatus = result,
        error: error => this.transferStatus = error
      });
    }
  }
}
