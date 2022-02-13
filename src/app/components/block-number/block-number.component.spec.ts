import { BlockNumberComponent } from './block-number.component';
import { NodeService } from 'src/app/services/node.service';

describe('BlockNumberComponent', () => {
    let component: BlockNumberComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(async () => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['nodeState$']);

        component = new BlockNumberComponent(nodeServiceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
