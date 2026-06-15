import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormButtonsComponent } from '../form-buttons/form-buttons.component';
import { Creneau } from '../../../model/creneau.model';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';

@Component({
  selector: 'app-creneau-dialog',
  standalone: true,
  imports: [
    FormsModule,
    FloatLabel,
    DatePicker,
    DialogModule,
    TableModule,
    ButtonModule,
    FormButtonsComponent,
    DateFormatPipe,
  ],
  template: `
    <p-dialog
      header="Créneaux"
      [visible]="showCreneauxDialog"
      (visibleChange)="fermerCreneauxDialog()"
      [modal]="true"
      [style]="{ width: '600px' }"
    >
      <p-table [value]="creneaux">
        <ng-template pTemplate="header">
          <tr>
            <th>Jour</th>
            <th>Date</th>
            <th>Heure</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-creneau>
          <tr>
            <td>{{ creneau.jourSemaine }}</td>
            <td>{{ creneau.date }}</td>
            <td>{{ creneau.heureDebut }}</td>
          </tr>
        </ng-template>
      </p-table>
      <ng-template pTemplate="footer">
        <div
          style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem"
        >
          <p-button
            label="Voir cours associés"
            [style]="{ 'background-color': '#217b8a', border: 'none' }"
            (onClick)="showCreneauxDialog = false; showTousCreneaux = true"
          />
          <p-button
            label="Créer un créneau"
            [style]="{ 'background-color': '#217b8a', border: 'none' }"
            (onClick)="showCreneauxDialog = false; showCreerCreneau = true"
          />
        </div>
      </ng-template>
    </p-dialog>

    <p-dialog
      header="Tous les créneaux"
      [visible]="showTousCreneaux"
      (visibleChange)="showTousCreneaux = $event; showCreneauxDialog = !$event"
      [modal]="true"
      [style]="{ width: '800px' }"
    >
      <p-table [value]="creneaux">
        <ng-template pTemplate="header">
          <tr>
            <th>Jour</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Associé à</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-creneau>
          <tr>
            <td>{{ creneau.jourSemaine }}</td>
            <td>{{ creneau.date }}</td>
            <td>{{ creneau.heureDebut }}</td>
            <td>{{ getAssociation(creneau.id) }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-dialog>

    <p-dialog
      header="Créer un créneau"
      [visible]="showCreerCreneau"
      (visibleChange)="showCreerCreneau = $event; showCreneauxDialog = !$event"
      [modal]="true"
      [style]="{ width: '400px' }"
    >
      <div style="display: flex; flex-direction: column; gap: 1.5rem; padding: 1rem">
        <p-floatlabel>
          <p-datepicker
            id="date"
            [(ngModel)]="creneau.date"
            [inline]="false"
            dateFormat="yy-mm-dd"
            [minDate]="dateMin"
            [appendTo]="'body'"
            style="width: 100%"
          />
          <label for="date">Date</label>
        </p-floatlabel>
        <p-floatlabel>
          <p-datepicker
            id="heureDebut"
            [(ngModel)]="creneau.heureDebut"
            [timeOnly]="true"
            [appendTo]="'body'"
            style="width: 100%"
          />
          <label for="heureDebut">Heure de début</label>
        </p-floatlabel>
        <app-form-buttons
          labelConfirmer="Créer"
          labelAnnuler="Annuler"
          (annuler)="showCreerCreneau = false; showCreneauxDialog = true"
          (confirmer)="onConfirmer()"
        />
      </div>
    </p-dialog>
  `,
})
export class CreneauDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() creneaux: Creneau[] = [];
  @Input() associations: { creneauId: number; titre: string }[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmer = new EventEmitter<any>();

  showCreneauxDialog = false;
  showTousCreneaux = false;
  showCreerCreneau = false;
  dateMin: Date = new Date();
  creneau: any = { date: null, heureDebut: null };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']) {
      this.showCreneauxDialog = changes['visible'].currentValue;
    }
  }

  fermerCreneauxDialog() {
    this.showCreneauxDialog = false;
    this.visibleChange.emit(false);
  }

  getAssociation(creneauId: number): string {
    const assoc = this.associations.find((a) => a.creneauId === creneauId);
    return assoc ? assoc.titre : 'Aucun';
  }

  onConfirmer() {
    this.confirmer.emit(this.creneau);
    this.creneau = { date: null, heureDebut: null };
    this.showCreerCreneau = false;
    this.showCreneauxDialog = true;
  }
}
