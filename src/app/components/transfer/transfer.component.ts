import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.sass']
})
export class TransferComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
    console.log('TransferComponent init');
  }
}
