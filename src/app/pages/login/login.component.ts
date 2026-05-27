import { Component, inject } from '@angular/core';
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

  login() {
    const user = (document.getElementById('user') as HTMLInputElement).value;
    const password = (document.getElementById('pass') as HTMLInputElement).value;

    this.http.post('/login', { user, password }).subscribe();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
