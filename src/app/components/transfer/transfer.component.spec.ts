import { EMPTY, from } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import { NodeService } from 'src/app/services/node.service';
import { TransferComponent } from './transfer.component';

describe('TransferComponent', () => {
    let component: TransferComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['transfer']);

        component = new TransferComponent(nodeServiceSpy, new FormBuilder());
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('form', () => {
        describe('toAddress', () => {
            it('should be required', () => {
                component.transferForm
                    .get('toAddress')!
                    .hasValidator(Validators.required);
            });
        })

        describe('amount', () => {
            it('should be required', () => {
                component.transferForm
                    .get('amount')!
                    .hasValidator(Validators.required);
            });

            it('should have a minimum of 1', () => {
                component.transferForm
                    .get('amount')!
                    .hasValidator(Validators.min(1));
            });
        })
    });

    describe('submit', () => {
        it('should submit if the form is valid', () => {
            const address = 'ABCD-EFGH-1234-5678';
            const amount = 10_000;

            component.transferForm.get('toAddress')!.setValue(address);
            component.transferForm.get('amount')!.setValue(amount);

            nodeServiceSpy.transfer.and.returnValue(EMPTY);

            component.submit();

            expect(nodeServiceSpy.transfer)
                .toHaveBeenCalledWith(amount, address);
        });

        it('should not submit if the form is invalid', () => {
            component.transferForm
                .get('toAddress')!
                .setValue('ABCD-EFGH-1234-5678');

            // not valid (below 0)
            component.transferForm.get('amount')!.setValue(0);

            component.submit();

            expect(nodeServiceSpy.transfer).not.toHaveBeenCalled();
        });
    });

    describe('transfer', () => {
        it('should update the transfer status', () => {
            const address = 'ABCD-EFGH-1234-5678';
            const amount = 10_000;

            component.transferForm.get('toAddress')!.setValue(address);
            component.transferForm.get('amount')!.setValue(amount);

            nodeServiceSpy.transfer
                .and
                .returnValue(from(['Transfer succeeded!']));

            component.submit();

            expect(component.transferStatus).toBe('Transfer succeeded!');
        });
    });
});
