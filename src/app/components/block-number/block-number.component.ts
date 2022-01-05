import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { SubstrateService } from 'src/app/services/substrate.service';

@Component({
  selector: 'app-block-number',
  templateUrl: './block-number.component.html',
  styleUrls: ['./block-number.component.sass']
})
export class BlockNumberComponent implements OnInit {

  // TODO finalized input (for two diff block components)
  // @Input()

  public blockNumber: number = 0;

  public blockNumberTimer: number = 0;

  private timerSubscription?: Subscription;

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    this.substrateService.state.subscribe((state) => {
      if (state.apiState === 'READY') {
        const { api } = state;

        const bestNumber: any = true /* finalized */
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
    this.timerSubscription = interval(1000).subscribe((seconds) => this.blockNumberTimer = seconds);
  }

  private resetTimer() {
    this.timerSubscription?.unsubscribe();
    this.blockNumberTimer = 0;
  }
}
