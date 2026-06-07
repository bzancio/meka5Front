import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/Auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  protected showEasterEgg = signal(false);
  protected isUserPage = signal(false);
  private clickCount = 0;
  private lastClickTime = 0;

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.isUserPage.set((e as NavigationEnd).url === '/user');
    });
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  onLogoClick(event: Event): void {
    event.preventDefault();
    const now = Date.now();

    if (now - this.lastClickTime > 500) {
      this.clickCount = 0;
    }

    this.clickCount++;
    this.lastClickTime = now;

    if (this.clickCount === 5) {
      this.clickCount = 0;
      this.showEasterEgg.set(true);
      setTimeout(() => this.showEasterEgg.set(false), 10);
      return;
    }

    if (this.clickCount === 1) {
      this.router.navigate(['']);
    }
  }
}
