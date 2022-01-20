import { Component, OnInit } from '@angular/core';

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
        this.nodeService.state$.subscribe(async (state) => {
            if (state?.apiState === 'READY') {
                const { api, socket } = state;

                if (api == null) {
                    throw 'api is null'
                }

                this.socket = socket;

                try {
                    const [chain, nodeName, nodeVersion] = await Promise.all([
                        api.rpc.system.chain(),
                        api.rpc.system.name(),
                        api.rpc.system.version()
                    ]);

                    this.chain = chain.toString();
                    this.nodeName = nodeName.toString();
                    this.nodeVersion = nodeVersion.toString();

                } catch (e) {
                    console.error(e);
                }
            }
        })
    }

}
