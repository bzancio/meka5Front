import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { HeaderComponent } from "../../shared/Header/header.component";
import { FooterComponent } from "../../shared/Footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private partialUrl = 'http://localhost:8080';

  text = signal<string>('');

  ngOnInit(): void {
    this.http.get(this.partialUrl + '/Hello?name=Mario Folleti', { responseType: 'text' })
    .subscribe({
      next: (response) => this.text.set(response),
      error: (err) => console.error('Error', err)
    });
  }
}
