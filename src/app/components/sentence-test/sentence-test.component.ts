import { Component, inject, signal, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

type CharState = 'pending' | 'correct' | 'incorrect';

interface WordChar {
  char: string;
  typed: string;
  state: CharState;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  hardestWords: { word: string; errors: number }[];
  hardestLetters: { letter: string; count: number }[];
}

@Component({
  selector: 'app-sentence-test',
  standalone: true,
  templateUrl: './sentence-test.component.html',
  styleUrl: './sentence-test.component.css'
})
export class SentenceTestComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);

  @ViewChild('wordsContainer') private wordsContainer?: ElementRef<HTMLElement>;

  wordList = signal<WordChar[][]>([]);
  currentWordIndex = signal(0);
  currentCharIndex = signal(0);
  isFinished = signal(false);
  result = signal<TestResult | null>(null);
  includePunctuation = signal(false);
  maintainCase = signal(false);
  selectedTime = signal<number>(15);
  timeLeft = signal<number>(15);
  mode = signal<'words' | 'sentences'>('words');
  newWordsFrom = signal<number>(-1);
  triggerFadeIn = signal(false);

  private isFetching = false;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private errorsByWord = new Map<number, number>();
  private errorsByLetter = new Map<string, number>();
  private startTime: number | null = null;
  private correctChars = 0;
  private totalChars = 0;

  private readonly baseUrl = 'https://api-meka5.bzancio.com/api';

  ngOnInit(): void {
    this.initialFetch();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  restart(): void {
    this.clearTimer();
    this.wordList.set([]);
    this.currentWordIndex.set(0);
    this.currentCharIndex.set(0);
    this.isFinished.set(false);
    this.result.set(null);
    this.errorsByWord.clear();
    this.errorsByLetter.clear();
    this.startTime = null;
    this.correctChars = 0;
    this.totalChars = 0;
    this.timeLeft.set(this.selectedTime());
    this.newWordsFrom.set(-1);
    this.triggerFadeIn.set(false);
    this.initialFetch();
  }

  selectTime(t: number): void {
    this.selectedTime.set(t);
    this.restart();
  }

  togglePunctuation(): void {
    this.includePunctuation.update(v => !v);
    this.restart();
  }

  toggleCase(): void {
    this.maintainCase.update(v => !v);
    this.restart();
  }

  selectMode(m: 'words' | 'sentences'): void {
    this.mode.set(m);
    this.restart();
  }

  private initialFetch(): void {
    if (this.mode() === 'sentences') {
      this.fetchInitialSentences();
    } else {
      this.fetchWords();
    }
  }

  private fetchInitialSentences(): void {
    if (this.isFetching) return;
    this.isFetching = true;

    const url = `${this.baseUrl}/words/sentence`;
    const params = {
      includePunctuation: this.includePunctuation(),
      maintainCase: this.maintainCase()
    };

    forkJoin([
      this.http.get<string[]>(url, { params }),
      this.http.get<string[]>(url, { params }),
      this.http.get<string[]>(url, { params })
    ]).subscribe({
      next: (results) => {
        const newWords = results.flat().map(word =>
          word.split('').map(char => ({ char, typed: '', state: 'pending' as CharState }))
        );
        this.wordList.update(current => [...current, ...newWords]);
        this.isFetching = false;
      },
      error: (err) => {
        console.error('Error fetching sentences', err);
        this.isFetching = false;
      }
    });
  }

  private fetchWords(): void {
    if (this.isFetching) return;
    this.isFetching = true;

    const isWords = this.mode() === 'words';
    const url = `${this.baseUrl}/words/${isWords ? 'common' : 'sentence'}`;
    const params: Record<string, string | number | boolean> = {
      includePunctuation: this.includePunctuation(),
      maintainCase: this.maintainCase()
    };
    if (isWords) params['size'] = 30;

    this.http.get<string[]>(url, { params }).subscribe({
      next: (response) => {
        const newWords = response.map(word =>
          word.split('').map(char => ({ char, typed: '', state: 'pending' as CharState }))
        );
        const startIdx = this.wordList().length;
        this.wordList.update(current => [...current, ...newWords]);
        if (startIdx > 0) this.newWordsFrom.set(startIdx);
        this.isFetching = false;
      },
      error: (err) => {
        console.error('Error fetching sentences', err);
        this.isFetching = false;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.restart();
      return;
    }

    if (this.isFinished()) return;

    const words = this.wordList();
    if (!words.length) return;

    if (this.startTime === null && event.key.length === 1) {
      this.startTime = Date.now();
      this.startTimer();
    }

    const wordIdx = this.currentWordIndex();
    const charIdx = this.currentCharIndex();

    if (event.key === 'Backspace') {
      this.handleBackspace(words, wordIdx, charIdx);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      this.handleSpace(wordIdx, charIdx, words.length);
      return;
    }

    if (event.key.length === 1) {
      this.handleChar(event.key, words, wordIdx, charIdx);
    }
  }

  private handleChar(key: string, words: WordChar[][], wordIdx: number, charIdx: number): void {
    const word = words[wordIdx];
    if (charIdx >= word.length) return;

    const expectedChar = word[charIdx].char;
    const isCorrect = key === expectedChar;

    this.totalChars++;
    if (isCorrect) {
      this.correctChars++;
    } else {
      this.errorsByWord.set(wordIdx, (this.errorsByWord.get(wordIdx) ?? 0) + 1);
      this.errorsByLetter.set(expectedChar, (this.errorsByLetter.get(expectedChar) ?? 0) + 1);
    }

    const updated = words.map((w, wi) =>
      wi !== wordIdx ? w : w.map((c, ci) =>
        ci !== charIdx ? c : { ...c, typed: key, state: (isCorrect ? 'correct' : 'incorrect') as CharState }
      )
    );

    this.wordList.set(updated);
    this.currentCharIndex.set(charIdx + 1);
    this.scrollWordIntoView(charIdx + 1 === word.length ? wordIdx + 1 : wordIdx);
  }

  private handleSpace(wordIdx: number, charIdx: number, totalWords: number): void {
    if (charIdx === 0) return;
    if (wordIdx + 1 >= totalWords) return;

    const nextIdx = wordIdx + 1;
    this.currentWordIndex.set(nextIdx);
    this.currentCharIndex.set(0);
    this.scrollWordIntoView(nextIdx);

    if (this.mode() === 'words') {
      if (nextIdx === 20) this.fetchWords();
      if (nextIdx === 25 && this.newWordsFrom() >= 0) this.triggerFadeIn.set(true);
    } else {
      if (nextIdx === 1) this.fetchWords();
      if (nextIdx === 2 && this.newWordsFrom() >= 0) this.triggerFadeIn.set(true);
    }
  }

  private handleBackspace(words: WordChar[][], wordIdx: number, charIdx: number): void {
    if (charIdx === 0) return;

    const updated = words.map((w, wi) =>
      wi !== wordIdx ? w : w.map((c, ci) =>
        ci !== charIdx - 1 ? c : { ...c, typed: '', state: 'pending' as CharState }
      )
    );

    this.wordList.set(updated);
    this.currentCharIndex.set(charIdx - 1);
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      const left = this.timeLeft() - 1;
      this.timeLeft.set(left);
      if (left <= 0) {
        this.clearTimer();
        this.finishTest();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private finishTest(): void {
    if (!this.startTime || this.totalChars === 0) return;

    const elapsed = (Date.now() - this.startTime) / 60000;
    const wpm = Math.round(this.correctChars / 5 / elapsed);
    const accuracy = Math.round((this.correctChars / this.totalChars) * 100);

    const hardestWords = Array.from(this.errorsByWord.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([idx, errors]) => ({
        word: this.wordList()[idx].map(c => c.char).join(''),
        errors
      }));

    const hardestLetters = Array.from(this.errorsByLetter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([letter, count]) => ({ letter, count }));

    this.result.set({ wpm, accuracy, hardestWords, hardestLetters });
    this.isFinished.set(true);

    this.http.post('https://api-meka5.bzancio.com/api/leaderboard/register', {
      score: wpm,
      time: this.selectedTime(),
      wpm,
      token: localStorage.getItem('tokenMeka5'),
      uppercase: this.maintainCase(),
      punctuation: this.includePunctuation()
    }).subscribe({
      error: (err) => console.error('Error registering leaderboard entry', err)
    });
  }

  getDisplayChar(ch: WordChar): string {
    return ch.state === 'incorrect' ? ch.typed : ch.char;
  }

  private scrollWordIntoView(wordIdx: number): void {
    setTimeout(() => {
      const container = this.wordsContainer?.nativeElement;
      if (!container) return;

      const wordEls = container.querySelectorAll<HTMLElement>('.word');
      const target = wordEls[wordIdx];
      if (!target) return;

      const targetBottom = target.offsetTop + target.offsetHeight;
      const containerBottom = container.scrollTop + container.clientHeight;

      if (targetBottom > containerBottom) {
        container.scrollTop = targetBottom - container.clientHeight;
      }
    }, 0);
  }
}
