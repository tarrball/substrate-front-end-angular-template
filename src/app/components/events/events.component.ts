import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';

import { NodeService } from 'src/app/services/node.service';

const FILTERED_OUT_EVENT_NAME_PHRASES = [
    'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
]

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.sass']
})
export class EventsComponent implements OnInit {
    public feedItems: FeedItem[] = [];

    constructor(private nodeService: NodeService) { }

    public ngOnInit(): void {
        this.nodeService.nodeState$
            .pipe(switchMap(value => value.api.query.system.events()))
            .subscribe(records => records.map(record => {
                const { event, phase } = record;
                const eventHuman = event.toHuman();

                const eventName = `${eventHuman['section']}:` +
                    `${eventHuman['method']}`;

                const eventNamePhase = `${eventName}::` +
                    `(phase=${phase.toString()})`;

                const eventParams = JSON.stringify(eventHuman['data']);

                if (!FILTERED_OUT_EVENT_NAME_PHRASES.includes(eventNamePhase)) {
                    this.feedItems.unshift({ eventName, eventParams })
                }
            }));

    }

    public clearEventFeed() {
        this.feedItems = [];
    }
}

interface FeedItem {
    eventName: string;

    eventParams: string;
}
