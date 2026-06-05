import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/Header/header.component';
import { FooterComponent } from '../../shared/Footer/footer.component';
import { SentenceTestComponent } from '../../components/sentence-test/sentence-test.component';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SentenceTestComponent],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.css'
})
export class TestsComponent {}
