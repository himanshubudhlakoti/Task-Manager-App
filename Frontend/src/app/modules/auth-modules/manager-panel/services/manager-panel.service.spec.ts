import { TestBed } from '@angular/core/testing';

import { ManagerPanelService } from './manager-panel.service';

describe('ManagerPanelService', () => {
  let service: ManagerPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
