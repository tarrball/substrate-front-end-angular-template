import { Component, OnInit } from '@angular/core';

import { SubstrateService } from './services/substrate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public title = 'substrate-angular-template';

  public constructor(private substrateService: SubstrateService) {
  }

  public ngOnInit() {
    // TODO route guard before gettin other components?
    this.substrateService.connectToNode();
    this.substrateService.loadAccounts();
  }
}
