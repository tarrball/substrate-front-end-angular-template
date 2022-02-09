import { Component, Input, OnInit } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';

import { BlockNumber } from '@polkadot/types/interfaces';
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
        this.nodeService.nodeState$
            .pipe(
                switchMap(({ api }) => this.finalized
                    ? api.derive.chain.bestNumberFinalized()
                    : api.derive.chain.bestNumber())
            )
            .subscribe((number) => this.setNewBestNumber(number));
    }

    private setNewBestNumber(blockNumber: BlockNumber) {
        this.blockNumber = blockNumber.toString();
        this.startNewTimer();
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
