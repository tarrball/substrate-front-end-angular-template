import { AccountSelectorComponent } from './account-selector.component';
import { NodeService } from 'src/app/services/node.service';

describe('AccountSelectorComponent', () => {
    let component: AccountSelectorComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['getAccounts']);

        component = new AccountSelectorComponent(nodeServiceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
