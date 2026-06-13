import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    FloatLabel,
    PasswordModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    Select,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './membres.component.html',
})
export class MembreComponent implements OnInit {
  membres: Utilisateur[] = [];
  showForm = signal(false);
  showNiveauDialog = signal(false);
  membreSelectionne = signal<Utilisateur | null>(null);
  niveauSelectionne = signal<number>(1);

  niveaux = [
    { label: 'Niveau 1', value: 1 },
    { label: 'Niveau 2', value: 2 },
    { label: 'Niveau 3', value: 3 },
    { label: 'Niveau 4', value: 4 },
    { label: 'Niveau 5', value: 5 },
  ];

  nouveauMembre: Utilisateur = {
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
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.chargerMembres();
  }

  chargerMembres() {
    this.utilisateurService.getAll().subscribe((data) => {
      this.membres = data;
    });
  }

  inscrire() {
    this.utilisateurService.inscrire(this.nouveauMembre).subscribe({
      next: () => {
        this.chargerMembres();
        this.showForm.set(false);
        this.nouveauMembre = {
          nom: '',
          prenom: '',
          courriel: '',
          nomUtilisateur: '',
          motDePasse: '',
          niveauExpertise: 1,
          adresse: { ville: '', pays: '' },
        };
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Membre inscrit avec succès',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.error.message,
        });
      },
    });
  }

  confirmerDesignation(membre: Utilisateur) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir désigner ${membre.prenom} ${membre.nom} comme enseignant ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utilisateurService.designerEnseignant(membre.identifiant!).subscribe({
          next: () => {
            this.chargerMembres();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${membre.prenom} ${membre.nom} est maintenant enseignant`,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: err.error.message,
            });
          },
        });
      },
    });
  }

  confirmerNiveau() {
    this.confirmationService.confirm({
      message: `Confirmer le niveau ${this.niveauSelectionne()} pour ${this.membreSelectionne()?.prenom} ${this.membreSelectionne()?.nom} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utilisateurService
          .mettreAJourNiveau(this.membreSelectionne()!.identifiant!, this.niveauSelectionne())
          .subscribe({
            next: () => {
              this.showNiveauDialog.set(false);
              this.chargerMembres();
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Niveau mis à jour avec succès`,
              });
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: err.error.message,
              });
            },
          });
      },
    });
  }

  confirmerSuppression(membre: Utilisateur) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer ${membre.prenom} ${membre.nom} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.utilisateurService.supprimer(membre.identifiant!).subscribe({
          next: () => {
            this.chargerMembres();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${membre.prenom} ${membre.nom} supprimé avec succès`,
            });
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: err.error.message,
            });
          },
        });
      },
    });
  }

  ouvrirDialogNiveau(membre: Utilisateur) {
    this.membreSelectionne.set(membre);
    this.niveauSelectionne.set(membre.niveauExpertise);
    this.showNiveauDialog.set(true);
  }
}
