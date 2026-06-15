import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompetitionService } from '../../services/competition.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { NotificationService } from '../../services/notification.service';
import { Competition } from '../../model/competition.model';
import { Resultat } from '../../model/resultat.model';
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
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { FormButtonsComponent } from '../shared/form-buttons/form-buttons.component';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { CoursService } from '../../services/cours.service';
import { CreneauDialogComponent } from '../shared/creneau-dialog/creneau-dialog.component';
import { CreneauService } from '../../services/creneau.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-competitions',
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
    DateFormatPipe,
    PageHeaderComponent,
    FormButtonsComponent,
    ActionButtonComponent,
    CreneauDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './competitions.component.html',
})
export class CompetitionsComponent implements OnInit {
  competitions = signal<Competition[]>([]);
  creneaux: Creneau[] = [];
  enseignants: Utilisateur[] = [];
  enseignantId: number | null = null;
  creneauSelectionne: number | null = null;
  dateMin: Date = new Date();

  showForm = signal(false);
  showCreneauxDialog = signal(false);
  showResultatsDialog = signal(false);
  competitionSelectionnee = signal<Competition | null>(null);
  resultats = signal<Resultat[]>([]);

  showEnregistrerResultatDialog = signal(false);
  eleveId: number | null = null;
  enseignantResultatId: number | null = null;
  nouvelleNote: number = 0;
  membres: Utilisateur[] = [];

  filtreNiveau = signal<number | null>(null);
  filtreEnseignantId = signal<number | null>(null);

  nouveauCreneau: any = {
    heureDebut: null,
    date: null,
  };

  nouvelleCompetition: Competition = {
    titre: '',
    lieu: '',
    niveauCible: undefined,
    duree: undefined,
    creneau: { id: undefined },
  };

  niveaux = [1, 2, 3, 4, 5].map((n) => ({ label: `Niveau ${n}`, value: n }));

  constructor(
    private competitionService: CompetitionService,
    private coursService: CoursService,
    private utilisateurService: UtilisateurService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    public creneauService: CreneauService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.chargerCompetitions();
    this.chargerCreneaux();
    this.chargerEnseignants();
    this.chargerMembres();
  }

  get aucunCreneau(): boolean {
    return this.creneaux.length === 0;
  }

  chargerCompetitions() {
    this.competitionService.getAll().subscribe({
      next: (data) => this.competitions.set(data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerCreneaux() {
    this.coursService.getAllCreneaux().subscribe({
      next: (data) => (this.creneaux = data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerEnseignants() {
    this.utilisateurService.getEnseignants().subscribe({
      next: (data) => (this.enseignants = data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerMembres() {
    this.utilisateurService.getMembres().subscribe({
      next: (data) => (this.membres = data),
      error: (err) => this.notificationService.error(err),
    });
  }

  creerCreneau(nouveauCreneau: any) {
    if (!nouveauCreneau.date || !nouveauCreneau.heureDebut) {
      this.notificationService.warn('Veuillez remplir tous les champs');
      return;
    }

    const creneauFormate = this.creneauService.formaterCreneau(nouveauCreneau);

    this.coursService.creerCreneau(creneauFormate).subscribe({
      next: () => {
        this.chargerCreneaux();
        this.notificationService.success('Créneau créé avec succès');
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  creerCompetition() {
    if (!this.enseignantId || !this.creneauSelectionne || !this.nouvelleCompetition.niveauCible) {
      this.notificationService.warn('Veuillez remplir tous les champs');
      return;
    }

    this.nouvelleCompetition.creneau = { id: this.creneauSelectionne };

    this.competitionService
      .creerCompetition(this.nouvelleCompetition, this.enseignantId)
      .subscribe({
        next: () => {
          this.chargerCompetitions();
          this.showForm.set(false);
          this.nouvelleCompetition = {
            titre: '',
            lieu: '',
            niveauCible: undefined,
            creneau: { id: undefined },
          };
          this.enseignantId = null;
          this.creneauSelectionne = null;
          this.notificationService.success('Compétition créée avec succès');
        },
        error: (err) => this.notificationService.error(err),
      });
  }

  confirmerSuppression(competition: Competition) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la compétition "${competition.titre}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.competitionService.supprimer(competition.identifiant!).subscribe({
          next: () => {
            this.chargerCompetitions();
            this.notificationService.success('Compétition supprimée avec succès');
          },
          error: (err) => this.notificationService.error(err),
        });
      },
    });
  }

  voirResultats(competition: Competition) {
    this.competitionSelectionnee.set(competition);
    this.competitionService.getResultatsParCompetition(competition.identifiant!).subscribe({
      next: (data) => {
        this.resultats.set(data);
        this.showResultatsDialog.set(true);
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  ouvrirEnregistrerResultat(competition: Competition) {
    this.competitionSelectionnee.set(competition);
    this.showEnregistrerResultatDialog.set(true);
  }

  enregistrerResultat() {
    if (!this.eleveId) {
      this.notificationService.warn('Veuillez sélectionner un élève');
      return;
    }

    if (this.nouvelleNote < 0 || this.nouvelleNote > 10) {
      this.notificationService.warn('La note doit être comprise entre 0 et 10');
      return;
    }

    const enseignantId = this.authService.utilisateurConnecte()?.identifiant;
    const resultat: Resultat = { note: this.nouvelleNote };

    this.competitionService
      .enregistrerResultat(
        resultat,
        this.eleveId,
        this.competitionSelectionnee()!.identifiant!,
        enseignantId!,
      )
      .subscribe({
        next: () => {
          this.chargerCompetitions();
          this.showEnregistrerResultatDialog.set(false);
          this.eleveId = null;
          this.nouvelleNote = 0;
          this.notificationService.success('Résultat enregistré avec succès');
        },
        error: (err) => this.notificationService.error(err),
      });
  }

  get creneauxOptions() {
    return this.creneaux.map((c) => ({
      label: `${c.jourSemaine} ${c.date} à ${c.heureDebut}`,
      value: c.id,
    }));
  }

  get enseignantsDisponibles() {
    if (!this.nouvelleCompetition.niveauCible) return this.enseignants;
    return this.enseignants.filter(
      (e) =>
        e.profilEnseignant &&
        e.profilEnseignant.niveauApte >= this.nouvelleCompetition.niveauCible!,
    );
  }

  onNiveauChange() {
    this.enseignantId = null;
  }

  competitionsFiltrees = computed(() => {
    return this.competitions().filter((c) => {
      const matchNiveau = this.filtreNiveau() ? c.niveauCible === this.filtreNiveau() : true;
      const matchEnseignant = this.filtreEnseignantId()
        ? c.enseignant?.identifiant === this.filtreEnseignantId()
        : true;
      return matchNiveau && matchEnseignant;
    });
  });

  getCompetitionParCreneau(creneauId: number): string {
    const comp = this.competitions().find((c) => c.creneau?.id === creneauId);
    return comp ? comp.titre : 'Aucune compétition';
  }

  get creneauxAssociations() {
    return this.creneaux.map((c) => ({
      creneauId: c.id!,
      titre: this.getCompetitionParCreneau(c.id!),
    }));
  }
}
