import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SubstrateService } from 'src/app/services/substrate.service';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.sass']
})
export class MetadataComponent implements OnInit {

  public metadata?: string;

  public version?: string;

  constructor(private substrateService: SubstrateService, private dialog: MatDialog) { }

  public ngOnInit(): void {
    this.substrateService.state$.subscribe(async (state) => {
      if (state.apiState !== 'READY') {
        return;
      }

      const data = await state.api.rpc.state.getMetadata();

      this.metadata = JSON.stringify(data, null, 2);
      this.version = data.version;
    })
  }

  public openDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
}
