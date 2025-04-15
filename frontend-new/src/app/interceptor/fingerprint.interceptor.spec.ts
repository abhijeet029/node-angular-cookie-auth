import { TestBed } from '@angular/core/testing';

import { FingerprintInterceptor } from './fingerprint.interceptor';

describe('FingerprintInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FingerprintInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FingerprintInterceptor = TestBed.inject(FingerprintInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
