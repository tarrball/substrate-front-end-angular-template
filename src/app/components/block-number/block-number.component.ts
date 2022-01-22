import { Component, Input, OnInit } from '@angular/core';
import { filter, interval, Subscription, take } from 'rxjs';

import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-block-number',
    templateUrl: 'block-number.component.html',
    styleUrls: ['./block-number.component.sass']
})
export class BlockNumberComponent implements OnInit {

  @Input() finalized: boolean = false;

  public blockNumber = '';

  public blockNumberTimer = 0;

  private timerSubscription?: Subscription;

  constructor(private nodeService: NodeService) { }

  public ngOnInit(): void {
      this.nodeService.state$
          .pipe(
              filter((f) => !!f), 
          )
          .subscribe((state) => {                
              const { api } = state!;

              const bestNumber = this.finalized
                  ? api.derive.chain.bestNumberFinalized()
                  : api.derive.chain.bestNumber();

              bestNumber.subscribe(number => {
                  this.blockNumber = number.toString();
                  this.startNewTimer();
              });
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
