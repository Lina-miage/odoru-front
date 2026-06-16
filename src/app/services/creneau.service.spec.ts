import { CreneauService } from './creneau.service';

describe('CreneauService', () => {
  let service: CreneauService;

  beforeEach(() => {
    service = new CreneauService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('formaterCreneau', () => {
    it('should format a creneau correctly', () => {
      const nouveauCreneau = {
        date: new Date(2026, 5, 22),
        heureDebut: new Date(2026, 5, 22, 10, 30),
      };

      const result = service.formaterCreneau(nouveauCreneau);

      expect(result.jourSemaine).toBe('Lundi');
      expect(result.date).toBe('2026-06-22');
      expect(result.heureDebut).toBe('10:30:00');
    });

    it('should pad single digit hours and minutes', () => {
      const nouveauCreneau = {
        date: new Date(2026, 5, 22),
        heureDebut: new Date(2026, 5, 22, 9, 5),
      };

      const result = service.formaterCreneau(nouveauCreneau);
      expect(result.heureDebut).toBe('09:05:00');
    });
  });

  describe('calculerHeureFin', () => {
    it('should calculate end time correctly', () => {
      expect(service.calculerHeureFin('10:00:00', 60)).toBe('11:00');
    });

    it('should handle minutes overflow', () => {
      expect(service.calculerHeureFin('10:45:00', 30)).toBe('11:15');
    });

    it('should return empty string if heureDebut is empty', () => {
      expect(service.calculerHeureFin('', 60)).toBe('');
    });

    it('should return empty string if duree is 0', () => {
      expect(service.calculerHeureFin('10:00:00', 0)).toBe('');
    });

    it('should handle midnight overflow', () => {
      expect(service.calculerHeureFin('23:00:00', 120)).toBe('01:00');
    });
  });
});
