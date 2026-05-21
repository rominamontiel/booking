import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BookingItemComponent } from './booking-item.component';
import { BookingModel } from '../../../../core/models/booking.interface';

describe('BookingItemComponent', () => {
  let component: BookingItemComponent;
  let fixture: ComponentFixture<BookingItemComponent>;

  const mockItem: BookingModel = {
    id: 1,
    className: 'Yoga',
    instructor: 'Laura Gómez',
    schedule: 'Lunes 18:00',
    availableSpots: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingItemComponent);
    fixture.componentRef.setInput('item', mockItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
