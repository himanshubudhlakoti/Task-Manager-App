import { TestBed } from '@angular/core/testing';

import { TeamLeadsPanelService } from './team-leads-panel.service';

describe('TeamLeadsPanelService', () => {
  let service: TeamLeadsPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamLeadsPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
