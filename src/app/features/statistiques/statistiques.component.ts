import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatistiqueService } from '../../services/statistique.service';
import { UtilisateurService } from '../../services/utilisateur.service';
import { CoursService } from '../../services/cours.service';
import { NotificationService } from '../../services/notification.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { Cours } from '../../model/cours.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    Select,
    ToastModule,
    DialogModule,
    FloatLabel,
    DatePicker,
    PageHeaderComponent,
    DateFormatPipe,
  ],
  providers: [MessageService],
  templateUrl: './statistiques.component.html',
})
export class StatistiquesComponent implements OnInit {
  nombreCours = signal<number>(0);
  moyennePresents = signal<number>(0);
  elevesPresents = signal<any[]>([]);
  coursParEleve = signal<any[]>([]);
  competitionsParEleve = signal<any[]>([]);
  nombreCompetitionsNiveau = signal<number>(0);

  membres: Utilisateur[] = [];
  cours: Cours[] = [];

  membreIdSelectionne: number | null = null;
  coursIdSelectionne: number | null = null;
  niveauSelectionne: number | null = null;
  dateDebut: Date | null = null;
  dateFin: Date | null = null;

  showElevesPresentsDialog = signal(false);
  showCoursEleveDialog = signal(false);
  showCompetitionsEleveDialog = signal(false);

  niveaux = [1, 2, 3, 4, 5].map((n) => ({ label: `Niveau ${n}`, value: n }));

  constructor(
    private statistiqueService: StatistiqueService,
    private utilisateurService: UtilisateurService,
    private coursService: CoursService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.chargerStatistiquesGlobales();
    this.chargerMembres();
    this.chargerCours();
  }

  chargerStatistiquesGlobales() {
    this.statistiqueService.getNombreCours().subscribe({
      next: (data) => this.nombreCours.set(data),
      error: (err) => this.notificationService.error(err),
    });

    this.statistiqueService.getMoyenneElevesPresents().subscribe({
      next: (data) => this.moyennePresents.set(data),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerMembres() {
    this.utilisateurService.getAll().subscribe({
      next: (data) => (this.membres = data.filter((u) => u.role === 'MEMBRE')),
      error: (err) => this.notificationService.error(err),
    });
  }

  chargerCours() {
    this.coursService.getAll().subscribe({
      next: (data) => (this.cours = data),
      error: (err) => this.notificationService.error(err),
    });
  }

  voirElevesPresents() {
    if (!this.coursIdSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un cours');
      return;
    }
    this.statistiqueService.getElevesPresentsACours(this.coursIdSelectionne).subscribe({
      next: (data) => {
        this.elevesPresents.set(data.eleves);
        this.showElevesPresentsDialog.set(true);
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  voirCoursParEleve() {
    if (!this.membreIdSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un membre');
      return;
    }
    const debut = this.dateDebut ? this.formaterDate(this.dateDebut) : undefined;
    const fin = this.dateFin ? this.formaterDate(this.dateFin) : undefined;

    this.statistiqueService.getCoursParEleve(this.membreIdSelectionne, debut, fin).subscribe({
      next: (data) => {
        this.coursParEleve.set(data);
        this.showCoursEleveDialog.set(true);
      },
      error: (err) => this.notificationService.error(err),
    });
  }

  voirCompetitionsParEleve() {
    if (!this.membreIdSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un membre');
      return;
    }
    const debut = this.dateDebut ? this.formaterDate(this.dateDebut) : undefined;
    const fin = this.dateFin ? this.formaterDate(this.dateFin) : undefined;

    this.statistiqueService
      .getCompetitionsParEleve(this.membreIdSelectionne, debut, fin)
      .subscribe({
        next: (data) => {
          this.competitionsParEleve.set(data);
          this.showCompetitionsEleveDialog.set(true);
        },
        error: (err) => this.notificationService.error(err),
      });
  }

  voirCompetitionsParNiveau() {
    if (!this.niveauSelectionne) {
      this.notificationService.warn('Veuillez sélectionner un niveau');
      return;
    }
    this.statistiqueService.getNombreCompetitionsParNiveau(this.niveauSelectionne).subscribe({
      next: (data) => this.nombreCompetitionsNiveau.set(data),
      error: (err) => this.notificationService.error(err),
    });
  }

  private formaterDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get coursOptions() {
    return this.cours.map((c) => ({
      label: `${c.titre} - ${c.creneau?.jourSemaine}`,
      value: c.identifiant,
    }));
  }
}
