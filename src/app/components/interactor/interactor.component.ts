import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
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

    public selectedRpcParams: RpcParam[] = [];

    public signedButtonLabel = 'Submit';

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

    public get palletParamArray(): FormArray {
        return this.interactorForm.get('palletParams') as FormArray;
    }

    public get palletParamControls(): FormControl[] {
        return this.palletParamArray
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
                    this.updateSubmitButtonLabel(type);
                    this.updatePalletRpcs(type);
                    this.palletRpcControl.setValue('');
                    this.clearPalletParameterFields();
                })

            this.palletRpcControl.valueChanges
                .subscribe((key: string) =>
                    this.updatePalletCallables(key));

            this.palletCallableControl.valueChanges
                .subscribe((callable: string) =>
                    this.updatePalletParameterFields(callable));

            this.interactionTypeControl.setValue(InteractionType.Extrinsic);
        })
    }

    private updateSubmitButtonLabel(type: InteractionType): void {
        this.signedButtonLabel = type === InteractionType.Query
            ? this.signedButtonLabel = 'Query'
            : this.signedButtonLabel = 'Submit';
    }

    private updatePalletRpcs(type: InteractionType): void {
        const api = this.getApi(type);

        this.palletRpcs = Object
            .keys(api)
            .filter(rpc => Object.keys(api[rpc]).length > 0)
            .sort();
    }

    private updatePalletCallables(palletKey: string): void {
        let callables: string[] = [];

        if (palletKey) {
            const api = this.getApi(this.interactionTypeControl.value);
            callables = Object.keys(api[palletKey]).sort();
        }

        this.palletCallables = callables;
    }

    private updatePalletParameterFields(callable: string): void {
        this.clearPalletParameterFields();

        const type = this.interactionTypeControl.value as InteractionType;
        const rpc = this.palletRpcControl.value as string;
        const api = this.getApi(type);

        if (type === InteractionType.Extrinsic) {
            api[rpc][callable].meta.args?.forEach((arg: any) => {
                const isOptional = this.isArgOptional(arg);
                const placeholder = arg.type.toString();
                const label = this.getLabel(arg, type, isOptional);

                this.selectedRpcParams.push({ label, placeholder, isOptional });

                const newControl = isOptional
                    ? this.fb.control('')
                    : this.fb.control('', Validators.required);

                this.palletParamArray.push(newControl);
            });
        }
    }

    private clearPalletParameterFields(): void {
        (this.interactorForm.get('palletParams') as FormArray).clear();
        this.selectedRpcParams = [];
    }

    private getApi(type: InteractionType): any {
        switch (type) {
            case InteractionType.Extrinsic:
                return this.nodeState.api.tx;
            case InteractionType.Query:
                return this.nodeState.api.query;
            case InteractionType.Rpc:
                return this.nodeState.api.rpc;
            case InteractionType.Constant:
            default:
                return this.nodeState.api.consts;
        }
    }

    private getLabel(arg: any, type: InteractionType, isOptional: boolean)
        : string {

        const name = arg.name.toString();

        if (!isOptional) {
            return name;
        }

        return name + type === InteractionType.Rpc
            ? ' (Optional)'
            : ' (Leaving this field blank will submit a NONE value';
    }

    private isArgOptional(arg: any): boolean {
        return arg.type.toString().startsWith('Option<');
    }
}

enum InteractionType {
    Extrinsic = 0,
    Query,
    Rpc,
    Constant
}

interface RpcParam {
    label: string;
    placeholder: string;
    isOptional: boolean;
}
