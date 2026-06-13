import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  success(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail,
    });
  }

  error(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: err.error?.message ?? 'Une erreur est survenue',
    });
  }

  warn(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Attention',
      detail,
    });
  }

  info(detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail,
    });
  }
}
