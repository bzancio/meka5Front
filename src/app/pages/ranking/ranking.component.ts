import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { HeaderComponent } from '../../shared/Header/header.component';
import { FooterComponent } from '../../shared/Footer/footer.component';

interface LeaderboardEntry {
  score: number;
  time: number;
  wpm: number;
  uppercase: boolean;
  punctuation: boolean;
  username: string;
}

const PAGE_SIZE = 10;

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, DecimalPipe],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit {
  private http = inject(HttpClient);

  entries = signal<LeaderboardEntry[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPage = signal(1);

  filterUsername = signal('');
  filterPunctuation = signal<boolean | null>(null);
  filterUppercase = signal<boolean | null>(null);

  filteredEntries = computed(() => {
    const name = this.filterUsername().toLowerCase().trim();
    const punct = this.filterPunctuation();
    const upper = this.filterUppercase();

    return this.entries().filter(e => {
      if (name && !e.username.toLowerCase().includes(name)) return false;
      if (punct !== null && e.punctuation !== punct) return false;
      if (upper !== null && e.uppercase !== upper) return false;
      return true;
    });
  });

  totalPages = computed(() => Math.ceil(this.filteredEntries().length / PAGE_SIZE));

  pageEntries = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredEntries().slice(start, start + PAGE_SIZE);
  });

  pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  globalIndex(localIndex: number): number {
    return (this.currentPage() - 1) * PAGE_SIZE + localIndex;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  setUsername(value: string): void {
    this.filterUsername.set(value);
    this.currentPage.set(1);
  }

  togglePunctuation(): void {
    this.filterPunctuation.update(v => v === null ? true : null);
    this.currentPage.set(1);
  }

  toggleUppercase(): void {
    this.filterUppercase.update(v => v === null ? true : null);
    this.currentPage.set(1);
  }

  ngOnInit(): void {
    this.http.get<LeaderboardEntry[]>('https://api-meka5.bzancio.com/api/leaderboard/all')
      .subscribe({
        next: (data) => { this.entries.set(data); this.loading.set(false); },
        error: () => { this.error.set(true); this.loading.set(false); }
      });
  }
}
