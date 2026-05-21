import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import BookingComponent from './booking.component';
import { BookingService } from '../../core/services/booking-service/booking.service';
import { BookingModel } from '../../core/models/booking.interface';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;

  const mockBookings: BookingModel[] = [
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
  ];

  beforeEach(async () => {
    bookingService = jasmine.createSpyObj('BookingService', ['getBookings']);

    await TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [
        { provide: BookingService, useValue: bookingService },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    bookingService.getBookings.and.returnValue(of([]));
    createComponent();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start with loading true and error hidden', () => {
      bookingService.getBookings.and.returnValue(of(mockBookings).pipe(delay(1000)));
      createComponent();

      expect(component.isLoading()).toBe(true);
      expect(component.showError()).toBe(false);
      expect(component.bookingList()).toEqual([]);
    });

    it('should expose alert type constants', () => {
      bookingService.getBookings.and.returnValue(of([]));
      createComponent();

      expect(component.TYPE_SUCCESS).toBe('success');
      expect(component.TYPE_ERROR).toBe('error');
    });
  });

  describe('successful load', () => {
    beforeEach(() => {
      bookingService.getBookings.and.returnValue(of(mockBookings));
      createComponent();
      fixture.detectChanges();
    });

    it('should set isLoading to false after bookings load', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should populate bookingList from the service', () => {
      expect(component.bookingList()).toEqual(mockBookings);
    });

    it('should not show error state', () => {
      expect(component.showError()).toBe(false);
    });
  });

  describe('empty results', () => {
    beforeEach(() => {
      bookingService.getBookings.and.returnValue(of([]));
      createComponent();
      fixture.detectChanges();
    });

    it('should finish loading with an empty list', () => {
      expect(component.isLoading()).toBe(false);
      expect(component.bookingList()).toEqual([]);
    });
  });

  describe('failed load', () => {
    beforeEach(() => {
      bookingService.getBookings.and.returnValue(
        throwError(() => new Error('Network error')),
      );
      createComponent();
      fixture.detectChanges();
    });

    it('should set showError to true', () => {
      expect(component.showError()).toBe(true);
    });

    it('should set isLoading to false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should fallback bookingList to an empty array', () => {
      expect(component.bookingList()).toEqual([]);
    });
  });

  describe('template', () => {
    it('should render the page title', () => {
      bookingService.getBookings.and.returnValue(of([]));
      createComponent();
      fixture.detectChanges();

      const title = (fixture.nativeElement as HTMLElement).querySelector('h1');
      expect(title?.textContent?.trim()).toBe('🏋️ Reservas disponibles');
    });

    it('should show loading indicator while data is pending', () => {
      bookingService.getBookings.and.returnValue(of(mockBookings).pipe(delay(1000)));
      createComponent();
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.textContent).toContain('Cargando....');
      expect(root.querySelector('app-loading')).not.toBeNull();
      expect(root.querySelector('app-alert')).toBeNull();
    });

    it('should render a booking item per result', () => {
      bookingService.getBookings.and.returnValue(of(mockBookings));
      createComponent();
      fixture.detectChanges();

      const items = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'app-booking-item',
      );
      expect(items.length).toBe(mockBookings.length);
    });

    it('should show empty message when there are no bookings', () => {
      bookingService.getBookings.and.returnValue(of([]));
      createComponent();
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.textContent).toContain('No se encontraron resultados');
      expect(root.querySelector('app-loading')).toBeNull();
    });

    it('should show error alert when the service fails', () => {
      bookingService.getBookings.and.returnValue(
        throwError(() => new Error('Network error')),
      );
      createComponent();
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.querySelector('app-alert')).not.toBeNull();
      expect(root.querySelector('app-loading')).toBeNull();
    });
  });
});
