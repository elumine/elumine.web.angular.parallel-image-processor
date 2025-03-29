import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { TodosComponent } from './todos/todos.component';

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
        path: 'todos',
        canActivate: [AuthGuard],
        loadComponent: () => import('./todos/todos.component').then(c => c.TodosComponent),
        children: [{
            path: 'todos/:id',
            component: TodosComponent,
        }]
    }, {
        path: 'todos/:id',
        canActivate: [AuthGuard],
        component: TodosComponent
    }
];
