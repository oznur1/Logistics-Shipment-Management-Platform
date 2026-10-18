
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/shipment-dashboard/shipment-dashboard').then(
        (module) => module.ShipmentDashboard,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
