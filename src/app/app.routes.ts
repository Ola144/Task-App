import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UsersComponent } from './pages/users/users.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { canDeactivateTaskGuard } from './guards/can-deactivate-task.guard';
import { resolveProject, resolveTicket, resolveUsers } from './guards/resolve-task.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [canDeactivateTaskGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: {tickets: resolveTicket}
            },
            {
                path: 'users',
                component: UsersComponent,
                resolve: {users: resolveUsers}
            },
            {
                path: 'projects',
                component: ProjectsComponent,
                resolve: {projects: resolveProject}
            },
        ]
    },
];
