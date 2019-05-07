/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Print2Service } from './print2.service';

describe('Service: Print2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Print2Service]
    });
  });

  it('should ...', inject([Print2Service], (service: Print2Service) => {
    expect(service).toBeTruthy();
  }));
});
