import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/Header/header.component';
import { FooterComponent } from '../../shared/Footer/footer.component';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './userInfo.component.html',
  styleUrls: ['./userInfo.component.css']
})
export class UserInfoComponent implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private partialUrl = 'http://localhost:8080/api';

  protected username = signal('');
  protected successMessage = signal('');

  ngOnInit(): void {
    const token = localStorage.getItem('tokenMeka5');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<{ username: string }>(`${this.partialUrl}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => this.username.set(response.username),
      error: () => this.router.navigate(['/login'])
    });
  }

  goToEditUsername() {
    this.router.navigate(['/edit-username']);
  }

  goToEditPassword() {
    this.router.navigate(['/edit-password']);
  }

  goToHome() {
    this.router.navigate(['']);
  }
}
