import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Metadata } from '@polkadot/types';
import { switchMap } from 'rxjs';

import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-metadata',
    templateUrl: './metadata.component.html',
    styleUrls: ['./metadata.component.sass']
})
export class MetadataComponent implements OnInit {

    public metadata?: string;

    public version?: string;

    constructor(private nodeService: NodeService, private dialog: MatDialog) { }

    public ngOnInit(): void {
        this.nodeService.nodeState$
            .pipe(
                switchMap(({ api }) => api.rpc.state.getMetadata())
            )
            .subscribe({
                next: (metadata) => this.setMetadata(metadata),
                error: console.error
            });
    }

    private setMetadata(metadata: Metadata) {
        this.metadata = JSON.stringify(metadata, null, 2);
        this.version = metadata.version.toString();
    }

    public openDialog(templateRef: TemplateRef<any>) {
        this.dialog.open(templateRef);
    }
}
