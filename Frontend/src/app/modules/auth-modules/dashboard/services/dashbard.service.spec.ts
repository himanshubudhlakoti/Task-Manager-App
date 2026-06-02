import { TestBed } from '@angular/core/testing';

import { DashbardService } from './dashbard.service';

describe('DashbardService', () => {
  let service: DashbardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashbardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
