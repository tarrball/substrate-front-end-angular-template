import { EventsComponent } from './events.component';
import { NodeService } from 'src/app/services/node.service';

describe('EventsComponent', () => {
    let component: EventsComponent;

    let nodeServiceSpy: jasmine.SpyObj<NodeService>;

    beforeEach(() => {
        nodeServiceSpy = jasmine.createSpyObj('NodeService', ['nodeState$']);

        component = new EventsComponent(nodeServiceSpy);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
