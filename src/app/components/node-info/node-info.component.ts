import { Component, OnInit } from '@angular/core';
import { forkJoin, switchMap, tap } from 'rxjs';

import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-node-info',
    templateUrl: 'node-info.component.html',
    styleUrls: ['./node-info.component.sass']
})
export class NodeInfoComponent implements OnInit {

    public chain = '';

    public nodeName = '';

    public nodeVersion = '';

    public socket = '';

    constructor(private nodeService: NodeService) { }

    public ngOnInit(): void {
        this.nodeService.nodeState$
            .pipe(
                tap((state) => this.socket = state.socket),
                switchMap((state) => {
                    const system = state.api.rpc.system;

                    return forkJoin({
                        chain: system.chain(),
                        name: system.name(),
                        version: system.version()
                    })
                })
            )
            .subscribe({
                next: ({ chain, name, version }) => {
                    this.chain = chain.toString();
                    this.nodeName = name.toString();
                    this.nodeVersion = version.toString()
                },
                error: console.error
            });
    }
}
