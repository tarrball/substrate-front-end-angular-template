import { TestBed } from '@angular/core/testing';

import { SubstrateService } from './substrate.service';

describe('SubstrateService', () => {
  let service: SubstrateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstrateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
