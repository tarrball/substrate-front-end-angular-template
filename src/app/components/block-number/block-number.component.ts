import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-block-number',
  templateUrl: 'block-number.component.html',
  styleUrls: ['./block-number.component.sass']
})
export class BlockNumberComponent implements OnInit {

  @Input() finalized: boolean = false;

  public blockNumber: number = 0;

  public blockNumberTimer: number = 0;

  private timerSubscription?: Subscription;

  constructor(private nodeService: NodeService) { }

  public ngOnInit(): void {
    // TODO clean up
    this.nodeService.state$.subscribe((state) => {
      if (state?.apiState === 'READY') {
        const { api } = state;

        if (api == null) {
          throw 'api is null'
        }

        const bestNumber: any = this.finalized
          ? api.derive.chain.bestNumberFinalized
          : api.derive.chain.bestNumber;

        bestNumber((number: any) => {
          this.blockNumber = number.toNumber();
          this.startNewTimer();
        });
      } else {
        console.log('not ready');
      }
    });
  }

  private startNewTimer() {
    this.resetTimer();

    this.timerSubscription = interval(1000)
      .subscribe((seconds) => this.blockNumberTimer = seconds);
  }

  private resetTimer() {
    this.timerSubscription?.unsubscribe();
    this.blockNumberTimer = 0;
  }
}
