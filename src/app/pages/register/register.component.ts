import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { Router } from '@angular/router';

function cleanInvisible(text: string): string {
  return text.replace(/[\s\u200B\u00A0\u200C\u200D\uFEFF]/g, '');
}

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

  protected user = signal('');
  protected userTouched = signal(false);

  protected pass = signal('');
  protected pass2 = signal('');

  protected error = signal('');

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

    this.http.post(`${this.partialUrl}/auth/register`, {
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
}
