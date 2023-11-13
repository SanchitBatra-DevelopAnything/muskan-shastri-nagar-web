import { TestBed } from '@angular/core/testing';

import { EditorderServiceService } from './editorder-service.service';

describe('EditorderServiceService', () => {
  let service: EditorderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
