import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  private partialUrl = 'https://api-meka5.bzancio.com/api';

  protected user = signal('');
  protected pass = signal('');
  protected error = signal('');

  ngOnInit(): void {
    const msg = this.auth.sessionExpiredMessage();
    if (msg) {
      this.error.set(msg);
      this.auth.sessionExpiredMessage.set(null);
    }
  }

  protected formValid = computed(() =>
    this.user().length > 0 && this.pass().length > 0
  );

  login() {
    this.error.set('');

    if (!this.formValid()) {
      this.error.set('Rellena todos los campos');
      return;
    }

    this.http.post<{ token: string }>(`${this.partialUrl}/auth/login`, {
      username: this.user(),
      password: this.pass()
    }).subscribe({
      next: (response) => {
        this.auth.setToken(response.token);
        localStorage.setItem('user', this.user());
        this.router.navigate(['']);
      },
      error: () => {
        this.error.set('Usuario y/o contraseña incorrectos');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
