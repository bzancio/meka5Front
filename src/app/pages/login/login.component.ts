import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  private http = inject(HttpClient);
  private router = inject(Router);
  private partialUrl = 'http://localhost:8080/api';
  protected error = signal('');

  login() {
    const user = (document.getElementById('user') as HTMLInputElement).value;
    const pass = (document.getElementById('pass') as HTMLInputElement).value;
    this.error.set('');
    this.http.post<{token: string}>(`${this.partialUrl}/auth/login`, { username: user, password: pass }).subscribe({
      next: (response) => {
        localStorage.setItem('tokenMeka5', response.token);
        this.router.navigate(['']);
      },
      error: () =>{
        this.error.set('Usuario y/o contraseña incorretos');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
