import { TestBed } from '@angular/core/testing';

import { SubHeaderService } from './sub-header.service';

describe('SubHeaderService', () => {
  let service: SubHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
