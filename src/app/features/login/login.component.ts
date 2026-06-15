import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FloatLabel,
    PasswordModule,
    ToastModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  nomUtilisateur: string = '';
  motDePasse: string = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  login() {
    if (!this.nomUtilisateur || !this.motDePasse) {
      this.notificationService.warn('Veuillez remplir tous les champs');
      return;
    }

    this.authService.login(this.nomUtilisateur, this.motDePasse).subscribe({
      next: (response) => {
        this.router.navigate([this.getRedirectUrl(response.role)]);
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  private getRedirectUrl(role: string): string {
    switch (role) {
      case 'PRESIDENT':
        return '/statistiques';
      case 'SECRETAIRE':
        return '/membres';
      case 'ENSEIGNANT':
        return '/cours';
      case 'MEMBRE':
        return '/cours';
      default:
        return '/cours';
    }
  }
}
