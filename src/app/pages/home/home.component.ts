import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/Header/header.component";
import { FooterComponent } from "../../shared/Footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  testText: string =
    'El texto no está asique toma emojis 🤣🤣🤣🤣👌🤣👌🤣😭😭😭😭🕔👌👌👌👌';
}
