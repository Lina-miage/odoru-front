import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem"
    >
      <h2 style="margin: 0">{{ titre }}</h2>
      <div style="display: flex; gap: 1rem; align-items: center">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() titre: string = '';
}
