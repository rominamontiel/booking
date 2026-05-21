import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { BookingModel } from '../../models/booking.interface';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBookings', () => {
    it('should return the list of bookings', fakeAsync(() => {
      let bookings: BookingModel[] = [];

      service.getBookings().subscribe((result) => (bookings = result));
      tick(1000);

      expect(bookings.length).toBe(6);
      expect(bookings[0].className).toBe('Yoga');
    }));
  });

  describe('getBookingById', () => {
    it('should return the booking when the id exists', fakeAsync(() => {
      let booking: BookingModel | undefined;

      service.getBookingById(2).subscribe((result) => (booking = result));
      tick(500);

      expect(booking?.id).toBe(2);
      expect(booking?.className).toBe('Crossfit');
    }));

    it('should return undefined when the id does not exist', fakeAsync(() => {
      let booking: BookingModel | undefined = {} as BookingModel;

      service.getBookingById(999).subscribe((result) => (booking = result));
      tick(500);

      expect(booking).toBeUndefined();
    }));
  });

  describe('reserveSpot', () => {
    it('should decrease available spots by one', fakeAsync(() => {
      let spotsBefore = 0;
      let spotsAfter = 0;

      service.getBookingById(5).subscribe((b) => (spotsBefore = b!.availableSpots));
      tick(500);

      service.reserveSpot(5);

      service.getBookingById(5).subscribe((b) => (spotsAfter = b!.availableSpots));
      tick(500);

      expect(spotsAfter).toBe(spotsBefore - 1);
    }));

    it('should not decrease spots below zero', fakeAsync(() => {
      for (let i = 0; i < 20; i++) {
        service.reserveSpot(6);
      }

      let spots = -1;
      service.getBookingById(6).subscribe((b) => (spots = b!.availableSpots));
      tick(500);

      expect(spots).toBe(0);
    }));

    it('should do nothing when the id does not exist', () => {
      expect(() => service.reserveSpot(999)).not.toThrow();
    });
  });
});
