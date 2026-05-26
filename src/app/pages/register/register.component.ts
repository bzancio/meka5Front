import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../shared/Footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private http: HttpClient) {}

  createAccount() {
    const user = (document.querySelector('#reg-user') as HTMLInputElement).value;
    const password = (document.querySelector('#reg-pass') as HTMLInputElement).value;

    this.http.post('/newUser', { user, password }).subscribe();
  }

}
