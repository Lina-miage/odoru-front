import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FormButtonsComponent } from '../form-buttons/form-buttons.component';

@Component({
  selector: 'app-creneau-dialog',
  standalone: true,
  imports: [FormsModule, FloatLabel, DatePicker, DialogModule, FormButtonsComponent],
  template: `
    <p-dialog
      header="Créer un créneau"
      [visible]="visible"
      (visibleChange)="visibleChange.emit($event)"
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
          (annuler)="visibleChange.emit(false)"
          (confirmer)="onConfirmer()"
        />
      </div>
    </p-dialog>
  `,
})
export class CreneauDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmer = new EventEmitter<any>();

  dateMin: Date = new Date();
  creneau: any = { date: null, heureDebut: null };

  onConfirmer() {
    this.confirmer.emit(this.creneau);
    this.creneau = { date: null, heureDebut: null };
  }
}
