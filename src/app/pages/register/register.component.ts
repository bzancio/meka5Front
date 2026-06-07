import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { cleanInvisible } from '../../shared/utils/text.utils';

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

  protected user = signal('');
  protected userTouched = signal(false);
  protected pass = signal('');
  protected pass2 = signal('');
  protected error = signal('');
  protected showPass = signal(false);
  protected showPass2 = signal(false);

  protected userValid = computed(() =>
    cleanInvisible(this.user()).length > 0
  );

  protected passwordsMatch = computed(() =>
    this.pass() === this.pass2()
  );

  protected formValid = computed(() =>
    this.userValid() && this.passwordsMatch()
  );

  createAccount() {
    this.error.set('');

    if (!this.formValid()) {
      this.error.set('Revisa los campos del formulario');
      return;
    }

    this.http.post(`${environment.apiUrl}/auth/register`, {
      username: this.user(),
      password: this.pass()
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error.set('Este usuario ya existe')
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['']);
  }
}
