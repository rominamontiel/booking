import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../../../core/services/booking-service/booking.service';
import { BookingModel } from '../../../../core/models/booking.interface';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AlertType } from '../../../../core/models/alert.type';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [LoadingComponent, RouterLink, AlertComponent],
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.scss',
})
export default class BookingDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);

  readonly TYPE_SUCCESS: AlertType = 'success';
  readonly TYPE_ERROR: AlertType = 'error';

  public isLoading = signal(true);
  public successReserved = signal(false);
  public showError = signal(false);

  public booking = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.bookingService.getBookingById(id)),
      tap(() => this.isLoading.set(false)),
      catchError(() => {
        this.isLoading.set(false);
        this.showError.set(true);
        return of(undefined);
      }),
    ),
    { initialValue: undefined },
  );

  reserve() {
    const booking = this.booking();

    if (booking && (booking.availableSpots ?? 0) > 0) {
      this.bookingService.reserveSpot(booking.id);
      this.successReserved.set(true);
    }
  }
}
