import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UtilisateurService } from '../../services/utilisateur.service';
import { NotificationService } from '../../services/notification.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    CardModule,
    FloatLabel,
    PasswordModule,
    InputNumberModule,
    ToastModule,
  ],
  templateUrl: './inscription.component.html',
})
export class InscriptionComponent {
  utilisateur: Utilisateur = {
    nom: '',
    prenom: '',
    courriel: '',
    nomUtilisateur: '',
    motDePasse: '',
    niveauExpertise: 1,
    adresse: { ville: '', pays: '' },
  };

  constructor(
    private utilisateurService: UtilisateurService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  inscrire() {
    if (
      !this.utilisateur.nom ||
      !this.utilisateur.prenom ||
      !this.utilisateur.courriel ||
      !this.utilisateur.nomUtilisateur ||
      !this.utilisateur.motDePasse
    ) {
      this.notificationService.warn('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.utilisateurService.inscrire(this.utilisateur).subscribe({
      next: () => {
        this.notificationService.success('Compte créé avec succès !');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => this.notificationService.error(err),
    });
  }
}
