import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-five',
  standalone: true,
  templateUrl: './5.component.html',
  styleUrl: './5.component.css'
})
export class FiveComponent {
  private router = inject(Router);

  back() {
    this.router.navigate(['']);
  }
}
