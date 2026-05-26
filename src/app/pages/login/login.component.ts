import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  constructor(private http: HttpClient) {}

  login() {
    const user = (document.getElementById('user') as HTMLInputElement).value;
    const password = (document.getElementById('pass') as HTMLInputElement).value;

    this.http.post('/login', { user, password }).subscribe();
  }

  newUser() {
    const user = (document.getElementById('user') as HTMLInputElement).value;
    const password = (document.getElementById('pass') as HTMLInputElement).value;

    this.http.post('/newUser', { user, password }).subscribe();
  }
}
