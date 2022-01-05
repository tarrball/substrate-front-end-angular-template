import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { SubstrateService } from 'src/app/services/substrate.service';

@Component({
  selector: 'app-block-number',
  template: `
    <mat-card>
      <mat-card-content>{{blockNumber}}</mat-card-content>
      <mat-card-content>{{finalized ? 'finalized' : 'current'}} block</mat-card-content>
      <mat-card-footer>{{blockNumberTimer}}</mat-card-footer>
    </mat-card>`,
  styleUrls: ['./block-number.component.sass']
})
export class BlockNumberComponent implements OnInit {

  @Input() finalized: boolean = false;

  public blockNumber: number = 0;

  public blockNumberTimer: number = 0;

  private timerSubscription?: Subscription;

  constructor(private substrateService: SubstrateService) { }

  public ngOnInit(): void {
    // TODO clean up
    this.substrateService.state.subscribe((state) => {
      if (state.apiState === 'READY') {
        const { api } = state;

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
