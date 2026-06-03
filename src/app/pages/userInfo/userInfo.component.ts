import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../../shared/Footer/footer.component";

@Component({
  selector: 'app-userInfo',
  standalone: true,
  templateUrl: './userInfo.component.html',
  styleUrls: ['./userInfo.component.css'],
  imports: [FooterComponent],
})
export class UserInfoComponent {

  constructor(private router: Router) {}

  goToChange() {
    this.router.navigate(['/change-credentials']);
  }

  back() {
    this.router.navigate(['/home']);
  }
}
