import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date from YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(pipe.transform('2026-06-15')).toBe('15/06/2026');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format date with single digit month and day', () => {
    expect(pipe.transform('2026-01-05')).toBe('05/01/2026');
  });
});
