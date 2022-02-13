import { MatDialog } from '@angular/material/dialog';
import { MetadataComponent } from './metadata.component';
import { NodeService } from 'src/app/services/node.service';

describe('MetadataComponent', () => {
    let component: MetadataComponent;

    let dialogMock: MatDialog;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(async () => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['nodeState$']);
        dialogMock = { open: jasmine.createSpy() } as any;

        component = new MetadataComponent(nodeServiceSpy, dialogMock);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('openDialog', () => {
        it('should open the dialog with the template ref', () => {
            const templateRef = { data: 'any old data will do' } as any;

            component.openDialog(templateRef);

            expect(dialogMock.open).toHaveBeenCalledWith(templateRef);
        })
    })
});
