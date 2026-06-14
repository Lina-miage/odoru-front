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
  secretaires: Utilisateur[] = [];
  enseignants: Utilisateur[] = [];
  cours: Cours[] = [];
  badges: Badge[] = [];
  presences = signal<Presence[]>([]);

  showAttribuerDialog = signal(false);
  showBadgerDialog = signal(false);
  showPresencesDialog = signal(false);

  membreIdSelectionne: number | null = null;
  secretaireIdSelectionne: number | null = null;
  coursIdSelectionne: number | null = null;
  numeroBadge: string = '';

  constructor(
    private badgeService: BadgeService,
    private utilisateurService: UtilisateurService,
    private coursService: CoursService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.chargerUtilisateurs();
    this.chargerCours();
    this.chargerBadges();
  }

  chargerUtilisateurs() {
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        this.membres = data.filter((u) => u.role === 'MEMBRE');
        this.secretaires = data.filter((u) => u.role === 'SECRETAIRE');
        this.enseignants = data.filter((u) => u.role === 'ENSEIGNANT');
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
    if (!this.membreIdSelectionne || !this.secretaireIdSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un membre et un secrétaire');
      return;
    }

    this.badgeService
      .attribuerBadge(this.membreIdSelectionne, this.secretaireIdSelectionne)
      .subscribe({
        next: () => {
          this.chargerBadges();
          this.showAttribuerDialog.set(false);
          this.membreIdSelectionne = null;
          this.secretaireIdSelectionne = null;
          this.notificationService.success('Badge attribué avec succès');
        },
        error: (err) => this.notificationService.error(err),
      });
  }

  confirmerDissociation(badge: Badge) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir dissocier le badge de ${badge.porteur?.prenom} ${badge.porteur?.nom} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.badgeService
          .dissocierBadge(badge.porteur!.identifiant!, this.secretaireIdSelectionne!)
          .subscribe({
            next: () => {
              this.badges = this.badges.filter((b) => b.identifiant !== badge.identifiant);
              this.notificationService.success('Badge dissocié avec succès');
            },
            error: (err) => this.notificationService.error(err),
          });
      },
    });
  }

  badger() {
    if (!this.numeroBadge || !this.coursIdSelectionne) {
      this.notificationService.warn('Veuillez remplir tous les champs');
      return;
    }

    this.badgeService.badger(this.numeroBadge, this.coursIdSelectionne).subscribe({
      next: () => {
        this.showBadgerDialog.set(false);
        this.numeroBadge = '';
        this.coursIdSelectionne = null;
        this.notificationService.success('Présence enregistrée avec succès');
      },
      error: (err) => this.notificationService.error(err),
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
}
