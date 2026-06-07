import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'tokenMeka5';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly username = signal<string | null>(null);
  readonly sessionExpiredMessage = signal<string | null>(null);

  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    const existing = this._token();
    if (existing) this.fetchUsername(existing);

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const token = this._token();
      if (token) this.fetchUsername(token);
    });
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
    this.fetchUsername(token);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.username.set(null);
  }

  private fetchUsername(token: string) {
    this.http.get(`${environment.apiUrl}/users/user`, { params: { token }, responseType: 'text' })
      .subscribe({
        next: (name) => this.username.set(name),
        error: () => this.username.set(null)
      });
  }
}
