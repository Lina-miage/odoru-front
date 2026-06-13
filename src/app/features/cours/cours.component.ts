import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../../services/cours.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Cours } from '../../model/cours.model';
import { Creneau } from '../../model/creneau.model';
import { Utilisateur } from '../../model/utilisateur.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-cours',
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
    TooltipModule,
    ConfirmDialogModule,
    Select,
    ToastModule,
    DialogModule,
    DatePicker,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cours.component.html',
})
export class CoursComponent implements OnInit {
  cours: Cours[] = [];
  creneaux: Creneau[] = [];
  enseignants: Utilisateur[] = [];
  enseignantId: number | null = null;
  creneauSelectionne: number | null = null;
  dateMin: Date = new Date();

  showForm = signal(false);
  showCreneauDialog = signal(false);
  showCreneauxDialog = signal(false);
  showTousCreneaux = signal(false);
  coursSelectionne = signal<Cours | null>(null);
  showInscritsDialog = signal(false);

  filtreNiveau = signal<number | null>(null);
  filtreEnseignantId = signal<number | null>(null);

  nouveauCreneau: any = {
    jourSemaine: '',
    heureDebut: null,
    date: null,
  };

  nouveauCours: Cours = {
    titre: '',
    lieu: '',
    niveauCible: undefined,
    duree: undefined,
    creneau: { id: undefined },
  };

  niveaux = [1, 2, 3, 4, 5].map((n) => ({ label: `Niveau ${n}`, value: n }));

  constructor(
    private coursService: CoursService,
    private utilisateurService: UtilisateurService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.chargerCours();
    this.chargerCreneaux();
    this.chargerEnseignants();
  }

  get aucunCreneau(): boolean {
    return this.creneaux.length === 0;
  }

  chargerCours() {
    this.coursService.getAll().subscribe((data) => {
      this.cours = data;
    });
  }

  chargerCreneaux() {
    this.coursService.getAllCreneaux().subscribe((data) => {
      this.creneaux = data;
    });
  }

  chargerEnseignants() {
    this.utilisateurService.getAll().subscribe((data) => {
      this.enseignants = data.filter((u) => u.role === 'ENSEIGNANT');
    });
  }

  creerCreneau() {
    if (!this.nouveauCreneau.date || !this.nouveauCreneau.heureDebut) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs',
      });
      return;
    }

    const date = this.nouveauCreneau.date as Date;
    const heure = this.nouveauCreneau.heureDebut as Date;

    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourSemaine = jours[date.getDay()];

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const creneauFormate: Creneau = {
      jourSemaine: jourSemaine,
      date: `${year}-${month}-${day}`,
      heureDebut: `${String(heure.getHours()).padStart(2, '0')}:${String(heure.getMinutes()).padStart(2, '0')}:00`,
    };

    this.coursService.creerCreneau(creneauFormate).subscribe({
      next: () => {
        this.chargerCreneaux();
        this.showCreneauDialog.set(false);
        this.nouveauCreneau = { jourSemaine: '', heureDebut: null, date: null };
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Créneau créé avec succès',
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

  creerCours() {
    if (!this.enseignantId || !this.creneauSelectionne) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez sélectionner un enseignant et un créneau',
      });
      return;
    }

    this.nouveauCours.creneau = { id: this.creneauSelectionne };

    this.coursService.creerCours(this.nouveauCours, this.enseignantId).subscribe({
      next: () => {
        this.chargerCours();
        this.showForm.set(false);
        this.nouveauCours = {
          titre: '',
          lieu: '',
          niveauCible: 1,
          duree: 60,
          creneau: { id: undefined },
        };
        this.enseignantId = null;
        this.creneauSelectionne = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Cours créé avec succès',
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

    if (!this.enseignantId || !this.creneauSelectionne || !this.nouveauCours.niveauCible) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir tous les champs obligatoires',
      });
      return;
    }
  }

  confirmerSuppression(cours: Cours) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le cours "${cours.titre}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.coursService.supprimer(cours.identifiant!).subscribe({
          next: () => {
            this.chargerCours();
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Cours supprimé avec succès',
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

  getCoursParCreneau(creneauId: number): string {
    const coursAssocie = this.cours.find((c) => c.creneau?.id === creneauId);
    return coursAssocie ? coursAssocie.titre : 'Aucun cours';
  }

  fermerTousCreneaux() {
    this.showTousCreneaux.set(false);
    this.showCreneauxDialog.set(true);
  }

  fermerCreerCreneau() {
    this.showCreneauDialog.set(false);
    this.showCreneauxDialog.set(true);
  }

  get creneauxOptions() {
    return this.creneaux.map((c) => ({
      label: `${c.jourSemaine} ${c.date} à ${c.heureDebut}`,
      value: c.id,
    }));
  }

  get enseignantsDisponibles() {
    if (!this.nouveauCours.niveauCible) return this.enseignants;

    return this.enseignants.filter(
      (e) => e.profilEnseignant && e.profilEnseignant.niveauApte >= this.nouveauCours.niveauCible!,
    );
  }

  onNiveauChange() {
    this.enseignantId = null;
  }

  calculerHeureFin(heureDebut: string, duree: number): string {
    if (!heureDebut || !duree) return '';

    const [heures, minutes, secondes] = heureDebut.split(':').map(Number);
    const totalMinutes = heures * 60 + minutes + duree;
    const heureFin = Math.floor(totalMinutes / 60) % 24;
    const minutesFin = totalMinutes % 60;

    return `${String(heureFin).padStart(2, '0')}:${String(minutesFin).padStart(2, '0')}`;
  }

  coursFiltres = computed(() => {
    return this.cours.filter((c) => {
      const matchNiveau = this.filtreNiveau() ? c.niveauCible === this.filtreNiveau() : true;
      const matchEnseignant = this.filtreEnseignantId()
        ? c.enseignant?.identifiant === this.filtreEnseignantId()
        : true;
      return matchNiveau && matchEnseignant;
    });
  });

  voirInscrits(cours: Cours) {
    this.coursSelectionne.set(cours);
    this.showInscritsDialog.set(true);
  }
}
