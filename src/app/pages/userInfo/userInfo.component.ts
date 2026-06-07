import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-userInfo',
  standalone: true,
  templateUrl: './userInfo.component.html',
  styleUrls: ['./userInfo.component.css'],
  imports: [FooterComponent],
})
export class UserInfoComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  protected username = localStorage.getItem('user') ?? 'Usuario';

  goToChange() {
    this.router.navigate(['/credentials']);
  }

  logout() {
    this.auth.logout();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  back() {
    this.router.navigate(['']);
  }
}
