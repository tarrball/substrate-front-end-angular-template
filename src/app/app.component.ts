import { Component, OnInit } from '@angular/core';

import { NodeService } from './services/node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public title = 'substrate-angular-template';

  public constructor(private nodeService: NodeService) {
  }

  public ngOnInit() {
    // TODO route guard before gettin other components?
    this.nodeService.connectToNode();
    this.nodeService.loadAccounts();
  }
}
