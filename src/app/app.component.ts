import { Component, OnInit } from '@angular/core';

import { NodeService } from './services/node.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
    public isConnected = false;

    public constructor(private nodeService: NodeService) {
    }

    public ngOnInit() {
        this.connectToNode();
    }

    private connectToNode() {
        this.nodeService
            .connectToNode()
            .subscribe({
                next: () => this.isConnected = true,
                error: (error) => {
                    this.isConnected = false;
                    console.error(error);
                }
            });
    }
}
