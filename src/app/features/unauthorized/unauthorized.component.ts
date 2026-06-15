import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  retour() {
    this.router.navigate(['/cours']);
  }
}
