import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { HeaderComponent } from '../../shared/Header/header.component';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { AuthService } from '../../services/Auth/auth.service';
import { environment } from '../../../environments/environment';
import { cleanInvisible } from '../../shared/utils/text.utils';

const PAGE_SIZE = 10;

interface PersonalEntry {
  score: number;
  time: number;
  wpm: number;
  average: number;
  uppercase: boolean;
  punctuation: boolean;
  username: string;
}

@Component({
  selector: 'app-userInfo',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, DecimalPipe],
  templateUrl: './userInfo.component.html',
  styleUrls: ['./userInfo.component.css'],
})
export class UserInfoComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  protected username = localStorage.getItem('user') ?? 'Usuario';
  protected activeTab = signal<'ranking' | 'info'>('ranking');

  protected entries = signal<PersonalEntry[]>([]);
  protected loading = signal(true);
  protected error = signal(false);
  protected currentPage = signal(1);

  protected filterTime = signal<number | null>(null);
  protected filterPunctuation = signal<boolean | null>(null);
  protected filterUppercase = signal<boolean | null>(null);

  protected filteredEntries = computed(() => {
    const punct = this.filterPunctuation();
    const upper = this.filterUppercase();
    const time = this.filterTime();
    const anyFlagActive = punct !== null || upper !== null;

    return this.entries().filter(e => {
      if (anyFlagActive) {
        if (e.punctuation !== (punct === true)) return false;
        if (e.uppercase !== (upper === true)) return false;
      }
      if (time !== null && e.time !== time) return false;
      return true;
    });
  });

  protected totalPages = computed(() => Math.ceil(this.filteredEntries().length / PAGE_SIZE));

  protected pageEntries = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredEntries().slice(start, start + PAGE_SIZE);
  });

  protected pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  protected avgAverage = computed(() => {
    const e = this.filteredEntries();
    if (!e.length) return null;
    return e.reduce((sum, entry) => sum + entry.average, 0) / e.length;
  });

  protected avgScore = computed(() => {
    const e = this.filteredEntries();
    if (!e.length) return null;
    return e.reduce((sum, entry) => sum + entry.score, 0) / e.length;
  });

  globalIndex(localIndex: number): number {
    return (this.currentPage() - 1) * PAGE_SIZE + localIndex;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  togglePunctuation(): void {
    this.filterPunctuation.update(v => v === null ? true : null);
    this.currentPage.set(1);
  }

  toggleUppercase(): void {
    this.filterUppercase.update(v => v === null ? true : null);
    this.currentPage.set(1);
  }

  selectTime(t: number): void {
    this.filterTime.update(v => v === t ? null : t);
    this.currentPage.set(1);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('tokenMeka5') ?? '';
    this.http.get<PersonalEntry[]>(`${environment.apiUrl}/leaderboard/me`, {
      params: { token }
    }).subscribe({
      next: (data) => { this.entries.set(data); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }

  protected oldPass = signal('');
  protected newUser = signal('');
  protected newPass = signal('');
  protected newPass2 = signal('');
  protected showOldPass = signal(false);
  protected showNewPass = signal(false);
  protected showNewPass2 = signal(false);
  protected changeError = signal('');

  protected newUserValid = computed(() => cleanInvisible(this.newUser()).length > 0);
  protected newPassValid = computed(() => cleanInvisible(this.newPass()).length > 0);
  protected passwordsMatch = computed(() => this.newPass() === this.newPass2());
  protected newIsDifferent = computed(() => this.newPass() !== this.oldPass());
  protected newUserIsDifferent = computed(() => this.newUser() !== (localStorage.getItem('user') ?? ''));
  protected formValid = computed(() =>
    cleanInvisible(this.oldPass()).length > 0 &&
    this.newUserValid() && this.newPassValid() &&
    this.passwordsMatch() && this.newIsDifferent() && this.newUserIsDifferent()
  );

  change(): void {
    this.changeError.set('');
    if (!this.formValid()) { this.changeError.set('Revisa los campos del formulario'); return; }

    const currentUser = localStorage.getItem('user') ?? '';
    this.http.post<{ token: string }>(`${environment.apiUrl}/auth/login`, {
      username: currentUser, password: this.oldPass()
    }).subscribe({
      next: () => {
        this.http.post(`${environment.apiUrl}/auth/change-password`, {
          currentUsername: currentUser,
          currentPassword: this.oldPass(),
          newUsername: this.newUser(),
          newPassword: this.newPass()
        }).subscribe({
          next: () => { localStorage.setItem('user', this.newUser()); this.username = this.newUser(); this.activeTab.set('ranking'); },
          error: () => this.changeError.set('Error al cambiar las credenciales')
        });
      },
      error: () => this.changeError.set('La contraseña actual no es correcta')
    });
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
