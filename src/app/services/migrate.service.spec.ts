import { TestBed } from '@angular/core/testing';

import { MigrateService } from './migrate.service';

describe('MigrateService', () => {
  let service: MigrateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MigrateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
