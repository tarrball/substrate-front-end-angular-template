import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
    } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';
import { NodeState } from 'src/app/data-contracts/node-state';

@Component({
    selector: 'app-interactor',
    templateUrl: './interactor.component.html',
    styleUrls: ['./interactor.component.sass']
})
export class InteractorComponent implements OnInit {
    public interactionType = InteractionType;

    public interactorForm = this.fb.group({
        interactionType: [undefined, Validators.required],
        palletRpc: ['', Validators.required],
        palletCallable: ['', Validators.required],
        palletParams: this.fb.array([])
    });

    public palletCallables: string[] = [];

    public palletRpcs: string[] = [];

    public signedDisabled = false;

    public sudoDisabled = false;

    public unsignedDisabled = false;

    public get interactionTypeControl(): AbstractControl {
        return this.interactorForm.get('interactionType')!
    }

    public get palletRpcControl(): AbstractControl {
        return this.interactorForm.get('palletRpc')!
    }

    public get palletCallableControl(): AbstractControl {
        return this.interactorForm.get('palletCallable')!
    }

    public get palletParamControls(): FormControl[] {
        return (this.interactorForm.get('palletParams') as FormArray)
            ?.controls
            ?.map(abstractControl => abstractControl as FormControl)
            ?? [];
    }

    private nodeState!: NodeState;

    constructor(private nodeService: NodeService, private fb: FormBuilder) {
    }

    public ngOnInit(): void {
        this.nodeService.nodeState$.subscribe((state) => {
            this.nodeState = state;

            this.interactionTypeControl.valueChanges
                .subscribe((type: InteractionType) => {
                    this.updatePalletRpcs(type);
                    this.palletRpcControl.reset();
                })

            this.palletRpcControl.valueChanges
                .subscribe((key: string) =>
                    this.updatePalletCallables(key));

            this.palletCallableControl.valueChanges
                .subscribe((callable: string) =>
                    this.updatePalletParameterFields(callable));

            this.interactionTypeControl.setValue(InteractionType.extrinsic);
        })
    }

    private updatePalletRpcs(type: InteractionType): void {
        const api = this.getApi(type);

        this.palletRpcs = Object
            .keys(api)
            .filter(rpc => Object.keys(api[rpc]).length > 0)
            .sort();
    }

    private updatePalletCallables(palletKey: string) {
        let callables: string[] = [];

        if (palletKey) {
            const api = this.getApi(this.interactionTypeControl.value);
            callables = Object.keys(api[palletKey]);
        }

        this.palletCallables = callables;
    }

    private updatePalletParameterFields(callable: string) {
        const params = this.interactorForm.get('palletParams')! as FormArray;

        const placeholder = true
            ? 'Optional Parameter'
            : 'Leaving this field as blank will submit a NONE value';

        const validators = true ? [Validators.required] : [];

        params.push(this.fb.control({
            name: ['', validators]
        }))

        params.push(this.fb.control({
            name: ['', validators]
        }))
    }

    private getApi(type: InteractionType): any {
        switch (type) {
            case InteractionType.extrinsic:
                return this.nodeState.api.tx;
            case InteractionType.query:
                return this.nodeState.api.query;
            case InteractionType.rpc:
                return this.nodeState.api.rpc;
            case InteractionType.constant:
            default:
                return this.nodeState.api.consts;
        }
    }
}

enum InteractionType {
    extrinsic = 0,
    query,
    rpc,
    constant
}
