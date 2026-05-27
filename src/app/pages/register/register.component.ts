import { Component, inject } from '@angular/core';
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

  createAccount() {
    const user = (document.getElementById('reg-user') as HTMLInputElement).value;
    const password = (document.getElementById('reg-pass') as HTMLInputElement).value;

    this.http.post('/newUser', { user, password }).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
