import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'tokenMeka5';
const API = 'https://api-meka5.bzancio.com/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly username = signal<string | null>(null);

  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    const existing = this._token();
    if (existing) this.fetchUsername(existing);
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
    this.http.get(`${API}/users/user`, { params: { token }, responseType: 'text' })
      .subscribe({
        next: (name) => this.username.set(name),
        error: () => this.username.set(null)
      });
  }
}
