import { BalancesComponent } from './balances.component';
import { NodeService } from 'src/app/services/node.service';

describe('BalancesComponent', () => {
    let component: BalancesComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['getAccounts']);

        component = new BalancesComponent(nodeServiceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
