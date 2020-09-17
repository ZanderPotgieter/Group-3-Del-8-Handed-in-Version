import { TestBed } from '@angular/core/testing';

import { CreditorPaymentService } from './creditor-payment.service';

describe('CreditorPaymentService', () => {
  let service: CreditorPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditorPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
