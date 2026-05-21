import { Injectable } from '@angular/core';
import { BookingModel } from '../../models/booking.interface';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly bookings: BookingModel[] = [
    {
      id: 1,
      className: 'Yoga',
      instructor: 'Laura Gómez',
      schedule: 'Lunes 18:00',
      availableSpots: 10,
    },
    {
      id: 2,
      className: 'Crossfit',
      instructor: 'Carlos Pérez',
      schedule: 'Martes 19:00',
      availableSpots: 5,
    },
    {
      id: 3,
      className: 'Spinning',
      instructor: 'Ana Torres',
      schedule: 'Miércoles 20:00',
      availableSpots: 8,
    },
    {
      id: 4,
      className: 'Yoga',
      instructor: 'Laura Gómez',
      schedule: 'Lunes 18:00',
      availableSpots: 10,
    },
    {
      id: 5,
      className: 'Crossfit',
      instructor: 'Carlos Pérez',
      schedule: 'Martes 19:00',
      availableSpots: 5,
    },
    {
      id: 6,
      className: 'Spinning',
      instructor: 'Ana Torres',
      schedule: 'Miércoles 20:00',
      availableSpots: 8,
    },
  ];

  getBookings(): Observable<BookingModel[]> {
    return of(this.bookings).pipe(delay(1000));
  }

  getBookingById(id: number): Observable<BookingModel | undefined> {
    const booking = this.bookings.find((b) => b.id === id);

    return of(booking).pipe(delay(500));
  }

  reserveSpot(id: number): void {
    const booking = this.bookings.find((b) => b.id === id);

    if (booking && booking.availableSpots > 0) {
      booking.availableSpots--;
    }
  }
}
