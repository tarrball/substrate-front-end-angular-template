import { NodeInfoComponent } from './node-info.component';
import { NodeService } from 'src/app/services/node.service';

describe('NodeInfoComponent', () => {
    let component: NodeInfoComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['nodeState$']);

        component = new NodeInfoComponent(nodeServiceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
