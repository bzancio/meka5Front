import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/Header/header.component";
import { FooterComponent } from "../../shared/Footer/footer.component";
import { CommonWordsComponent } from "../../components/common-words/common-words.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonWordsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
