import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [NotificationService, { provide: MessageService, useValue: messageServiceSpy }],
    });

    service = TestBed.inject(NotificationService);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call messageService.add with success severity', () => {
    service.success('Opération réussie');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Succès',
      detail: 'Opération réussie',
    });
  });

  it('should call messageService.add with error severity', () => {
    const err = { error: { message: 'Une erreur est survenue' } };
    service.error(err);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue',
    });
  });

  it('should use default error message when error message is undefined', () => {
    service.error({});
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue',
    });
  });

  it('should call messageService.add with warn severity', () => {
    service.warn('Attention');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Attention',
      detail: 'Attention',
    });
  });

  it('should call messageService.add with info severity', () => {
    service.info('Information');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info',
      detail: 'Information',
    });
  });
});
