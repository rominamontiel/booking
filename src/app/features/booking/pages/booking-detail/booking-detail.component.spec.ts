import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import BookingDetailComponent from './booking-detail.component';
import { BookingService } from '../../../../core/services/booking-service/booking.service';
import { BookingModel } from '../../../../core/models/booking.interface';

describe('BookingDetailComponent', () => {
  let component: BookingDetailComponent;
  let fixture: ComponentFixture<BookingDetailComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;

  const mockBooking: BookingModel = {
    id: 1,
    className: 'Yoga',
    instructor: 'Laura Gómez',
    schedule: 'Lunes 18:00',
    availableSpots: 10,
  };

  beforeEach(async () => {
    bookingService = jasmine.createSpyObj('BookingService', [
      'getBookingById',
      'reserveSpot',
    ]);

    await TestBed.configureTestingModule({
      imports: [BookingDetailComponent],
      providers: [
        provideRouter([]),
        { provide: BookingService, useValue: bookingService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    }).compileComponents();
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(BookingDetailComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    bookingService.getBookingById.and.returnValue(of(mockBooking));
    createComponent();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should start loading with no booking loaded', () => {
      bookingService.getBookingById.and.returnValue(of(mockBooking).pipe(delay(500)));
      createComponent();

      expect(component.isLoading()).toBe(true);
      expect(component.showError()).toBe(false);
      expect(component.successReserved()).toBe(false);
      expect(component.booking()).toBeUndefined();
    });

    it('should expose alert type constants', () => {
      bookingService.getBookingById.and.returnValue(of(mockBooking));
      createComponent();

      expect(component.TYPE_SUCCESS).toBe('success');
      expect(component.TYPE_ERROR).toBe('error');
    });
  });

  describe('successful load', () => {
    beforeEach(() => {
      bookingService.getBookingById.and.returnValue(of(mockBooking));
      createComponent();
      fixture.detectChanges();
    });

    it('should request the booking using the route id', () => {
      expect(bookingService.getBookingById).toHaveBeenCalledWith(1);
    });

    it('should set isLoading to false', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should populate the booking signal', () => {
      expect(component.booking()).toEqual(mockBooking);
    });
  });

  describe('failed load', () => {
    beforeEach(() => {
      bookingService.getBookingById.and.returnValue(
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

    it('should leave booking as undefined', () => {
      expect(component.booking()).toBeUndefined();
    });
  });

  describe('reserve', () => {
    beforeEach(() => {
      bookingService.getBookingById.and.returnValue(of(mockBooking));
      createComponent();
      fixture.detectChanges();
    });

    it('should reserve a spot and show success', () => {
      component.reserve();

      expect(bookingService.reserveSpot).toHaveBeenCalledWith(1);
      expect(component.successReserved()).toBe(true);
    });

    it('should not reserve when there are no spots left', () => {
      bookingService.getBookingById.and.returnValue(
        of({ ...mockBooking, availableSpots: 0 }),
      );
      createComponent();
      fixture.detectChanges();

      component.reserve();

      expect(bookingService.reserveSpot).not.toHaveBeenCalled();
      expect(component.successReserved()).toBe(false);
    });
  });

  describe('template', () => {
    it('should render booking details', () => {
      bookingService.getBookingById.and.returnValue(of(mockBooking));
      createComponent();
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.querySelector('h1')?.textContent?.trim()).toBe('Yoga');
      expect(root.textContent).toContain('Laura Gómez');
      expect(root.textContent).toContain('Lunes 18:00');
      expect(root.textContent).toContain('10');
    });

    it('should show loading while data is pending', () => {
      bookingService.getBookingById.and.returnValue(of(mockBooking).pipe(delay(500)));
      createComponent();
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      expect(root.querySelector('app-loading')).not.toBeNull();
      expect(root.querySelector('app-alert')).toBeNull();
    });

    it('should disable reserve button after a successful reservation', () => {
      bookingService.getBookingById.and.returnValue(of(mockBooking));
      createComponent();
      fixture.detectChanges();

      const button = (fixture.nativeElement as HTMLElement).querySelector(
        'button:not(.secondary)',
      ) as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      expect(button.disabled).toBe(true);
      expect(fixture.nativeElement.querySelector('app-alert')).not.toBeNull();
    });

    it('should show error alert when loading fails', () => {
      bookingService.getBookingById.and.returnValue(
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
