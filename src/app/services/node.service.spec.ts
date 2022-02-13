import { NodeService } from './node.service';
import { TestBed } from '@angular/core/testing';

describe('NodeService', () => {
    let service: NodeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NodeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
