import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('template', () => {
    it('should render success message when type is success', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      const successEl = root.querySelector('.success-message');
      const errorEl = root.querySelector('.error-message');

      expect(successEl).not.toBeNull();
      expect(successEl?.textContent?.trim()).toBe('✅ Reservado con éxito');
      expect(errorEl).toBeNull();
    });

    it('should render error message when type is error', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();

      const root = fixture.nativeElement as HTMLElement;
      const successEl = root.querySelector('.success-message');
      const errorEl = root.querySelector('.error-message');

      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('⛔ Ha ocurrido un error');
      expect(successEl).toBeNull();
    });
  });
});
