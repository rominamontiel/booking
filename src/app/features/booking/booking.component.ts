import { Component, inject, signal } from '@angular/core';
import { BookingItemComponent } from './components/booking-item/booking-item.component';
import { BookingModel } from '../../core/models/booking.interface';
import { BookingService } from '../../core/services/booking-service/booking.service';
import { catchError, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { AlertType } from '../../core/models/alert.type';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [BookingItemComponent, LoadingComponent, AlertComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export default class BookingComponent {
  private readonly bookingService = inject(BookingService);
  readonly TYPE_SUCCESS: AlertType = 'success';
  readonly TYPE_ERROR: AlertType = 'error';
  public isLoading = signal(true);
  public showError = signal(false);

  public bookingList = toSignal(
    this.bookingService.getBookings().pipe(
      tap(() => this.isLoading.set(false)),
      catchError(() => {
        this.showError.set(true);
        this.isLoading.set(false);
        return of([]);
      }),
    ),
    { initialValue: [] as BookingModel[] }, // Valor inicial mientras el Observable emite
  );
}
