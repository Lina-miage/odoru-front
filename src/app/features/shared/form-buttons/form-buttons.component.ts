import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-buttons',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div style="display: flex; justify-content: flex-end; gap: 1rem">
      <p-button
        [label]="labelAnnuler"
        [style]="{ 'background-color': '#90949E', border: 'none' }"
        (onClick)="annuler.emit()"
      />
      <p-button
        [label]="labelConfirmer"
        [style]="{ 'background-color': '#217b8a', border: 'none' }"
        (onClick)="confirmer.emit()"
      />
    </div>
  `,
})
export class FormButtonsComponent {
  @Input() labelAnnuler = 'Annuler';
  @Input() labelConfirmer = 'Confirmer';
  @Output() annuler = new EventEmitter<void>();
  @Output() confirmer = new EventEmitter<void>();
}
