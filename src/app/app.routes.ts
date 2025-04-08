import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './common/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth/login'
    }, 
    {
        path: 'auth',
        component: AuthComponent,
        children: [{
            path: 'login', component: LoginComponent
        }]
    }, {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
    }
];
