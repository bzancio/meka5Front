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

  totalPages = computed(() => Math.ceil(this.entries().length / PAGE_SIZE));

  pageEntries = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.entries().slice(start, start + PAGE_SIZE);
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

  ngOnInit(): void {
    const mock: LeaderboardEntry[] = Array.from({ length: 50 }, (_, i) => ({
      username: `user${i + 1}`,
      wpm: parseFloat((Math.random() * 80 + 40).toFixed(2)),
      score: parseFloat((Math.random() * 30 + 70).toFixed(2)),
      time: [15, 30, 60][i % 3],
      uppercase: i % 3 === 0,
      punctuation: i % 2 === 0
    }));
    this.entries.set(mock);
    this.loading.set(false);

    // TODO: descomentar cuando la API esté lista
    // this.http.get<LeaderboardEntry[]>('https://api-meka5.bzancio.com/api/leaderboard/all')
    //   .subscribe({
    //     next: (data) => { this.entries.set(data); this.loading.set(false); },
    //     error: () => { this.error.set(true); this.loading.set(false); }
    //   });
  }
}
