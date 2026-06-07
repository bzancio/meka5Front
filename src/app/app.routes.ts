import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UserInfoComponent } from './pages/userInfo/userInfo.component';
import { ChangeCredentialsComponent } from './pages/changeCredentials/changeCredentials.component';
import { TestsComponent } from './pages/tests/tests.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { FiveComponent } from './shared/Header/5.component';
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
    path: 'credentials',
    component: ChangeCredentialsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tests',
    component: TestsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'ranking',
    component: RankingComponent,
    canActivate: [authGuard],
  },
  {
    path: '5',
    component: FiveComponent,
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

