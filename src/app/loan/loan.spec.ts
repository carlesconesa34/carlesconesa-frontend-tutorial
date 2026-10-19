import { TestBed } from '@angular/core/testing';
import { Loan } from './model/loan';

describe('Loan', () => {
  let service: Loan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Loan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
