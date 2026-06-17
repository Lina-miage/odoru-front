import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../../services/cours.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { NotificationService } from '../../services/notification.service';
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
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { FormButtonsComponent } from '../shared/form-buttons/form-buttons.component';
import { ActionButtonComponent } from '../shared/action-button/action-button.component';
import { CreneauDialogComponent } from '../shared/creneau-dialog/creneau-dialog.component';
import { CreneauService } from '../../services/creneau.service';
import { AuthService } from '../../services/auth.service';
import { BadgeService } from '../../services/badge.service';

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
    PageHeaderComponent,
    DateFormatPipe,
    FormButtonsComponent,
    ActionButtonComponent,
    CreneauDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './cours.component.html',
})
export class CoursComponent implements OnInit {
  cours = signal<Cours[]>([]);
  creneaux = signal<Creneau[]>([]);
  enseignants: Utilisateur[] = [];
  enseignantId: number | null = null;
  creneauSelectionne: number | null = null;

  showForm = signal(false);
  showCreneauxDialog = signal(false);
  coursSelectionne = signal<Cours | null>(null);
  showInscritsDialog = signal(false);
  filtreNiveau = signal<number | null>(null);
  filtreEnseignantId = signal<number | null>(null);
  presencesMembre = signal<any[]>([]);

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
    private notificationService: NotificationService,
    public creneauService: CreneauService,
    public authService: AuthService,
    private badgeService: BadgeService,
  ) {}

  ngOnInit() {
    this.chargerCours();
    this.chargerCreneaux();
    this.chargerEnseignants();
    if (this.authService.getRole() === 'MEMBRE') {
      this.verifierBadgeEtPresences();
    }
  }

  get aucunCreneau(): boolean {
    return this.creneaux().length === 0;
  }

  chargerCours() {
    this.coursService.getAll().subscribe({
      next: (data) => this.cours.set(data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerCreneaux() {
    this.coursService.getAllCreneaux().subscribe({
      next: (data) => this.creneaux.set(data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerEnseignants() {
    this.utilisateurService.getEnseignants().subscribe({
      next: (data) => (this.enseignants = data),
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
        this.showCreneauxDialog.set(false);
        this.notificationService.success('Créneau créé avec succès');
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  creerCours() {
    if (
      !this.enseignantId ||
      !this.creneauSelectionne ||
      !this.nouveauCours.niveauCible ||
      !this.nouveauCours.duree ||
      !this.nouveauCours.titre ||
      !this.nouveauCours.lieu
    ) {
      this.notificationService.warn('Veuillez remplir tous les champs');
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
          niveauCible: undefined,
          duree: undefined,
          creneau: { id: undefined },
        };
        this.enseignantId = null;
        this.creneauSelectionne = null;
        this.notificationService.success('Cours créé avec succès');
      },
      error: (err) => this.notificationService.error(err),
    });
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
            this.notificationService.success('Cours supprimé avec succès');
          },
          error: (err) => this.notificationService.error(err),
        });
      },
    });
  }

  get creneauxOptions() {
    return this.creneaux().map((c) => ({
      label: `${c.jourSemaine} ${c.date} à ${c.heureDebut}`,
      value: c.id,
    }));
  }

  get enseignantsDisponibles() {
    if (!this.nouveauCours.niveauCible) return this.enseignants;
    return this.enseignants.filter(
      (e) => e.profilEnseignant && e.profilEnseignant.niveauApte == this.nouveauCours.niveauCible!,
    );
  }

  onNiveauChange() {
    this.enseignantId = null;
  }

  coursFiltres = computed(() => {
    const membreId = this.authService.utilisateurConnecte()?.identifiant;
    const role = this.authService.getRole();

    let liste = this.cours();

    if (role === 'MEMBRE') {
      liste = liste.filter((c) => c.inscrits?.some((i) => i.eleve?.identifiant === membreId));
    }

    return liste.filter((c) => {
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

  verifierBadgeEtPresences() {
    const membreId = this.authService.utilisateurConnecte()?.identifiant;
    if (!membreId) return;

    this.badgeService.getPresencesByEleve(membreId).subscribe({
      next: (presences) => {
        this.presencesMembre.set(presences);
      },
      error: () => {},
    });
  }

  aBadgePourCours(coursId: number): boolean {
    return this.presencesMembre().some((p) => p.cours?.identifiant === coursId);
  }

  badgerCours(cours: Cours) {
    this.confirmationService.confirm({
      message: `Confirmer votre présence au cours "${cours.titre}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const membreId = this.authService.utilisateurConnecte()?.identifiant;
        this.badgeService.getBadgeByMembre(membreId!).subscribe({
          next: (badge) => {
            this.badgeService.badger(badge.numero!, cours.identifiant!).subscribe({
              next: () => {
                this.notificationService.success('Présence enregistrée avec succès');
                this.verifierBadgeEtPresences();
              },
              error: (err) => this.notificationService.error(err),
            });
          },
          error: () => this.notificationService.warn("Vous n'avez pas de badge"),
        });
      },
    });
  }

  getCoursParCreneau(creneauId: number): string {
    const coursAssocie = this.cours().find((c) => c.creneau?.id === creneauId);
    return coursAssocie ? coursAssocie.titre : 'Aucun cours';
  }

  creneauxAssociations = computed(() => {
    return this.creneaux().map((c) => ({
      creneauId: c.id!,
      titre: this.getCoursParCreneau(c.id!),
    }));
  });

  coursAvecStatut = computed(() => {
    return this.coursFiltres().map((c) => ({
      ...c,
      statut: this.calculerStatut(c),
    }));
  });

  private calculerStatut(cours: Cours): 'en_cours' | 'pas_commence' | 'termine' {
    if (!cours.creneau?.date || !cours.creneau?.heureDebut) return 'pas_commence';

    const maintenant = new Date();
    const [year, month, day] = cours.creneau.date.split('-').map(Number);
    const dateCours = new Date(year, month - 1, day);

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    dateCours.setHours(0, 0, 0, 0);

    if (dateCours > aujourdhui) return 'pas_commence';
    if (dateCours < aujourdhui) return 'termine';

    const [h, m] = cours.creneau.heureDebut.split(':').map(Number);
    const heureDebut = new Date();
    heureDebut.setHours(h, m, 0, 0);

    const heureFin = new Date(heureDebut);
    heureFin.setMinutes(heureFin.getMinutes() + (cours.duree ?? 0));

    if (maintenant < heureDebut) return 'pas_commence';
    if (maintenant > heureFin) return 'termine';
    return 'en_cours';
  }
}
