import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { BoardsComponent } from './todos/boards.component';
import { BoardViewComponent } from './todos/board-view/board-view.component';

export const routes: Routes = [{
        path: '',
        pathMatch: 'full',
        redirectTo: '/auth/login'
    }, {
        path: 'auth',
        component: AuthComponent,
        children: [{
            path: 'login', component: LoginComponent
        }]
    }, {
        path: 'boards',
        canActivate: [AuthGuard],
        loadComponent: () => import('./todos/boards.component').then(c => c.BoardsComponent)
    }, {
        path: 'boards/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./todos/board-view/board-view.component').then(c => c.BoardViewComponent)
    }
];
