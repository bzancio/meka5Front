import { Component, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private http = inject(HttpClient);
  private router = inject(Router);
  private partialUrl = 'https://api-meka5.bzancio.com/api';
  protected error = signal('');

  createAccount() {
    this.error.set('')
    const user = (document.getElementById('reg-user') as HTMLInputElement).value;
    const pass = (document.getElementById('reg-pass') as HTMLInputElement).value;

    this.http.post(`${this.partialUrl}/auth/register`, { username: user, password: pass }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) =>{
        this.error.set('Este usuario ya existe')
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
