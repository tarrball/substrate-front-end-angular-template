import { Component, OnInit } from '@angular/core';

import { SubstrateService } from 'src/app/services/substrate.service';

@Component({
  selector: 'app-node-info',
  template: `
    <mat-card>
      <mat-card-header>{{nodeName}}</mat-card-header>
      <mat-card-content>
        <label>{{chain}}</label>
        <label>{{socket}}</label>
      </mat-card-content>
      <mat-divider></mat-divider>
      <mat-card-footer>
        <mat-icon aria-hidden="false" aria-label="Gear icon">gear</mat-icon>
        {{nodeVersion}}
      </mat-card-footer>
    </mat-card>
    `,
  styleUrls: ['./node-info.component.sass']
})
export class NodeInfoComponent implements OnInit {

  public chain = '';

  public nodeName = '';

  public nodeVersion = '';

  public socket = '';

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    this.substrateService.state.subscribe(async (state) => {
      if (state.apiState === 'READY') {
        const { api, socket } = state;

        this.socket = socket;

        try {
          const [chain, nodeName, nodeVersion] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.system.name(),
            api.rpc.system.version()
          ]);

          this.chain = chain;
          this.nodeName = nodeName;
          this.nodeVersion = nodeVersion;

        } catch (e) {
          console.error(e);
        }
      }
    })
  }

}
