import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeService } from '../../services/badge.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { NotificationService } from '../../services/notification.service';
import { CoursService } from '../../services/cours.service';
import { Badge } from '../../model/badge.model';
import { Presence } from '../../model/presence.model';
import { Utilisateur } from '../../model/utilisateur.model';
import { Cours } from '../../model/cours.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { ConfirmationService } from 'primeng/api';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { FormButtonsComponent } from '../shared/form-buttons/form-buttons.component';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TooltipModule,
    ConfirmDialogModule,
    Select,
    ToastModule,
    DialogModule,
    FloatLabel,
    PageHeaderComponent,
    FormButtonsComponent,
    ActionButtonComponent,
    DateFormatPipe,
  ],
  providers: [ConfirmationService],
  templateUrl: './badges.component.html',
})
export class BadgesComponent implements OnInit {
  membres: Utilisateur[] = [];
  cours: Cours[] = [];
  badges: Badge[] = [];
  presences = signal<Presence[]>([]);

  showAttribuerDialog = signal(false);
  showBadgerDialog = signal(false);
  showPresencesDialog = signal(false);
  showDissocierDialog = signal(false);
  badgeADissocier = signal<Badge | null>(null);

  membreIdSelectionne: number | null = null;
  coursIdSelectionne: number | null = null;
  membreBadgerIdSelectionne: number | null = null;

  constructor(
    private badgeService: BadgeService,
    private utilisateurService: UtilisateurService,
    private coursService: CoursService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.chargerUtilisateurs();
    this.chargerCours();
  }

  chargerUtilisateurs() {
    this.utilisateurService.getMembres().subscribe({
      next: (data) => {
        this.membres = data;
        this.chargerBadges();
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerCours() {
    this.coursService.getAll().subscribe({
      next: (data) => (this.cours = data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerBadges() {
    this.membres.forEach((m) => {
      this.badgeService.getBadgeByMembre(m.identifiant!).subscribe({
        next: (badge) => {
          if (!this.badges.find((b) => b.identifiant === badge.identifiant)) {
            this.badges.push(badge);
          }
        },
        error: () => {},
      });
    });
  }

  attribuerBadge() {
    if (!this.membreIdSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un membre');
      return;
    }

    const secretaireId = this.authService.utilisateurConnecte()?.identifiant;

    this.badgeService.attribuerBadge(this.membreIdSelectionne, secretaireId!).subscribe({
      next: () => {
        this.chargerBadges();
        this.showAttribuerDialog.set(false);
        this.membreIdSelectionne = null;
        this.notificationService.success('Badge attribué avec succès');
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  badger() {
    if (!this.membreBadgerIdSelectionne || !this.coursIdSelectionne) {
      this.notificationService.warn('Veuillez remplir tous les champs');
      return;
    }

    // Récupérer le badge du membre
    this.badgeService.getBadgeByMembre(this.membreBadgerIdSelectionne).subscribe({
      next: (badge) => {
        this.badgeService.badger(badge.numero!, this.coursIdSelectionne!).subscribe({
          next: () => {
            this.showBadgerDialog.set(false);
            this.membreBadgerIdSelectionne = null;
            this.coursIdSelectionne = null;
            this.notificationService.success('Présence enregistrée avec succès');
          },
          error: (err) => this.notificationService.error(err),
        });
      },
      error: () => this.notificationService.warn("Ce membre n'a pas de badge"),
    });
  }

  voirPresences(badge: Badge) {
    this.badgeService.getPresencesByEleve(badge.porteur!.identifiant!).subscribe({
      next: (data) => {
        this.presences.set(data);
        this.showPresencesDialog.set(true);
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  get coursOptions() {
    return this.cours.map((c) => ({
      label: `${c.titre} - ${c.creneau?.jourSemaine} ${c.creneau?.date}`,
      value: c.identifiant,
    }));
  }

  ouvrirDissociation(badge: Badge) {
    this.badgeADissocier.set(badge);
    this.showDissocierDialog.set(true);
  }

  dissocierBadge() {
    const secretaireId = this.authService.utilisateurConnecte()?.identifiant;

    this.badgeService
      .dissocierBadge(this.badgeADissocier()!.porteur!.identifiant!, secretaireId!)
      .subscribe({
        next: () => {
          this.badges = this.badges.filter(
            (b) => b.identifiant !== this.badgeADissocier()!.identifiant,
          );
          this.showDissocierDialog.set(false);
          this.notificationService.success('Badge dissocié avec succès');
        },
        error: (err) => this.notificationService.error(err),
      });
  }

  get aucunBadge(): boolean {
    return this.badges.length === 0;
  }

  get membresSansBadge(): Utilisateur[] {
    return this.membres.filter(
      (m) => !this.badges.find((b) => b.porteur?.identifiant === m.identifiant),
    );
  }

  get tousLesMembresOntUnBadge(): boolean {
    return this.membres.length > 0 && this.membresSansBadge.length === 0;
  }
}
