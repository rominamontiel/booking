import { Component, input } from '@angular/core';
import { AlertType } from '../../../core/models/alert.type';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly TYPE_SUCCESS: AlertType = 'success';
  readonly TYPE_ERROR: AlertType = 'error';

  type = input.required<AlertType>();
}
