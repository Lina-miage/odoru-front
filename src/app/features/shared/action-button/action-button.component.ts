import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <p-button
      [icon]="icon"
      [rounded]="true"
      [disabled]="disabled"
      [style]="{ 'background-color': disabled ? '#90949E' : couleur, border: 'none' }"
      [pTooltip]="tooltip"
      tooltipPosition="top"
      (onClick)="!disabled && clicked.emit()"
    />
  `,
})
export class ActionButtonComponent {
  @Input() icon: string = '';
  @Input() couleur: string = '#217b8a';
  @Input() tooltip: string = '';
  @Input() disabled: boolean = false;

  @Output() clicked = new EventEmitter<void>();
}
