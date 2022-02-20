import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';

@Component({
    selector: 'app-interactor',
    templateUrl: './interactor.component.html',
    styleUrls: ['./interactor.component.sass']
})
export class InteractorComponent {
    public interactionType = InteractionType;

    public interactorForm = this.fb.group({
        type: [InteractionType.extrinsic, Validators.required]
    })

    public signedDisabled = false;

    public sudoDisabled = false;

    public unsignedDisabled = false;

    constructor(private nodeService: NodeService, private fb: FormBuilder) {
    }
}

enum InteractionType {
    extrinsic = 0,
    query,
    rpc,
    constant
}
