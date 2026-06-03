import { Routes, CanActivateFn } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UserInfoComponent } from './pages/userInfo/userInfo.component';
import { authGuard, noAuthGuard } from './services/Auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[noAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate:[noAuthGuard],
  },
  {
    path: 'user',
    component: UserInfoComponent,
    canActivate:[authGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

