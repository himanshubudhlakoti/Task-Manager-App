import { TestBed } from '@angular/core/testing';

import { EmployeesPanelService } from './employees-panel.service';

describe('EmployeesPanelService', () => {
  let service: EmployeesPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeesPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
