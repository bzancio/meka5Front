import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  testText: string =
    'El texto no está asique toma emojis 🤣🤣🤣🤣👌🤣👌🤣😭😭😭😭🕔👌👌👌👌';
}
