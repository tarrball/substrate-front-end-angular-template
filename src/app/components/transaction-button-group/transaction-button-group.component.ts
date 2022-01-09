import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-button-group',
  templateUrl: './transaction-button-group.component.html',
  styleUrls: ['./transaction-button-group.component.sass']
})
export class TransactionButtonGroupComponent implements OnInit {

  public signedDisabled = false;

  public sudoDisabled = false;

  public unsignedDisabled = false;

  constructor() { }

  public ngOnInit(): void {
    console.log('TransactionButtonGroupComponent ngOnInit');
  }
}
