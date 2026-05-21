import { Routes } from "@angular/router";

export const BOOKING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./booking.component')
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/booking-detail/booking-detail.component')
    }
    
]