import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.sass']
})
export class EventsComponent implements OnInit {

    public feedItems: FeedItem[] = [];

    constructor() { }

    public ngOnInit(): void {
        this.feedItems = [{
            name: 'system:ExtrinsicSuccess',
            params: '[{"weight":"195,952,000","class":"Normal","paysFee":"Yes"}]'
        }, {
            name: 'balances:Transfer',
            params: '["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy","500,000"]'
        },{
            name: 'system:ExtrinsicSuccess',
            params: '[{"weight":"195,952,000","class":"Normal","paysFee":"Yes"}]'
        }, {
            name: 'balances:Transfer',
            params: '["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy","500,000"]'
        },{
            name: 'system:ExtrinsicSuccess',
            params: '[{"weight":"195,952,000","class":"Normal","paysFee":"Yes"}]'
        }, {
            name: 'balances:Transfer',
            params: '["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy","500,000"]'
        },{
            name: 'system:ExtrinsicSuccess',
            params: '[{"weight":"195,952,000","class":"Normal","paysFee":"Yes"}]'
        }, {
            name: 'balances:Transfer',
            params: '["5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc","5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy","500,000"]'
        }]
    }

    public clearEventFeed(): void {
        this.feedItems = [];
    }
}

interface FeedItem {
  name: string;

  params: string;
}
