import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

import { RegisterComponent } from './pages/register/register.component';

import { HomeComponent } from './pages/home/home.component';

import { UserInfoComponent } from './pages/userInfo/userInfo.component';

export const routes: Routes = [
  {
    path: 'login',
      component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

   {
    path: 'userInfo',
      component: UserInfoComponent,
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

