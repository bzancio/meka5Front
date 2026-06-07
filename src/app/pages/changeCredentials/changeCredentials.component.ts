import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { environment } from '../../../environments/environment';
import { cleanInvisible } from '../../shared/utils/text.utils';

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

  protected oldPass = signal('');
  protected newUser = signal('');
  protected newPass = signal('');
  protected newPass2 = signal('');
  protected showOldPass = signal(false);
  protected showNewPass = signal(false);
  protected showNewPass2 = signal(false);
  protected error = signal('');

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
    this.newPass() !== this.oldPass()
  );

  protected newUserIsDifferent = computed(() =>
    this.newUser() !== (localStorage.getItem('user') ?? '')
  );

  protected formValid = computed(() =>
    cleanInvisible(this.oldPass()).length > 0 &&
    this.newUserValid() &&
    this.newPassValid() &&
    this.passwordsMatch() &&
    this.newIsDifferent() &&
    this.newUserIsDifferent()
  );

  change() {
    this.error.set('');

    if (!this.formValid()) {
      this.error.set('Revisa los campos del formulario');
      return;
    }

    const currentUser = localStorage.getItem('user') ?? '';

    this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
      username: currentUser,
      password: this.oldPass()
    }).subscribe({
      next: () => {
        this.http.post(`${environment.apiUrl}/auth/change-password`, {
          currentUsername: currentUser,
          currentPassword: this.oldPass(),
          newUsername: this.newUser(),
          newPassword: this.newPass()
        }).subscribe({
          next: () => {
            localStorage.setItem('user', this.newUser());
            this.router.navigate(['/user']);
          },
          error: () => this.error.set('Error al cambiar las credenciales')
        });
      },
      error: () => this.error.set('La contraseña actual no es correcta')
    });
  }

  back() {
    this.router.navigate(['/user']);
  }
}
