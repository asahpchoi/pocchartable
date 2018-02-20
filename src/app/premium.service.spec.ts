import { TestBed, inject } from '@angular/core/testing';
import { PremiumService } from './premium.service';

describe('PremiumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PremiumService]
    });
  });

  it('should be created', inject([PremiumService], (service: PremiumService) => {
    expect(service).toBeTruthy();
  }));
});
