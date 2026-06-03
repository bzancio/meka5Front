import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/Footer/footer.component';

function cleanInvisible(text: string): string {
  return text.replace(/[\s\u200B\u00A0\u200C\u200D\uFEFF]/g, '');
}

@Component({
  selector: 'app-changeCredentials',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './changeCredentials.component.html',
  styleUrls: ['./changeCredentials.component.css']
})
export class ChangeCredentialsComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private partialUrl = 'https://api-meka5.bzancio.com/api';

  protected oldUser = signal(localStorage.getItem('user') ?? '');
  protected oldPass = signal('');
  protected newUser = signal('');
  protected newPass = signal('');
  protected newPass2 = signal('');

  protected error = signal('');
  protected touched = signal(false);

  protected oldUserValid = computed(() =>
    cleanInvisible(this.oldUser()).length > 0
  );

  protected oldPassValid = computed(() =>
    cleanInvisible(this.oldPass()).length > 0
  );

  protected newUserValid = computed(() =>
    cleanInvisible(this.newUser()).length > 0
  );

  protected newPassValid = computed(() =>
    cleanInvisible(this.newPass()).length > 0
  );

  protected passwordsMatch = computed(() =>
    this.newPass() === this.newPass2()
  );

  protected newIsDifferent = computed(() =>
    cleanInvisible(this.newPass()).length > 0 &&
    this.newPass() !== this.oldPass()
  );

  protected formValid = computed(() =>
    this.oldUserValid() &&
    this.oldPassValid() &&
    this.newUserValid() &&
    this.newPassValid() &&
    this.passwordsMatch() &&
    this.newIsDifferent()
  );

  change() {
    this.touched.set(true);
    this.error.set('');

    if (!this.formValid()) {
      this.error.set('Revisa los campos del formulario');
      return;
    }

    const body = {
      oldUser: this.oldUser(),
      oldPass: this.oldPass(),
      newUser: this.newUser(),
      newPass: this.newPass()
    };

    this.http.post(`${this.partialUrl}/auth/change-password`, body).subscribe({
      next: () => this.router.navigate(['/user']),
      error: () => this.error.set('La contraseña actual no es correcta')
    });
  }

  back() {
    this.router.navigate(['/user']);
  }
}
