import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs';

import { NodeService } from './services/node.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public initializing = true;

  public constructor(private nodeService: NodeService) {
  }

  public ngOnInit() {
    this.nodeService.initialize()
      .pipe(filter((f) => f?.apiState === 'READY'), take(1))
      .subscribe(() => this.initializing = false);
  }
}
