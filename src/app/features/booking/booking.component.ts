import { Component } from '@angular/core';
import { BookingItemComponent } from './components/booking-item/booking-item.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [BookingItemComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export default class BookingComponent {
  
}
