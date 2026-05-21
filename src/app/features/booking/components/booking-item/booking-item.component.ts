import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingModel } from '../../../../core/models/booking.interface';

@Component({
  selector: 'app-booking-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-item.component.html',
  styleUrl: './booking-item.component.scss'
})
export class BookingItemComponent {
  item = input.required<BookingModel>()
}
