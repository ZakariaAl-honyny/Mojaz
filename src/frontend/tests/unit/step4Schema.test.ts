import { step4Schema } from '@/lib/validations/step4Schema';

describe('step4Schema', () => {
  describe('validation', () => {
    it('should accept valid complete data', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid applicant type', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Visitor',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid preferredCenterId', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: 'not-a-uuid',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty preferredCenterId', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid test language', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'fr',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid appointment preference', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'Night',
        specialNeedsDeclaration: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('special needs validation', () => {
    it('should accept without special needs note when not declared', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: false,
        specialNeedsNote: undefined,
      });
      expect(result.success).toBe(true);
    });

    it('should accept with special needs note when declared', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: true,
        specialNeedsNote: 'I need wheelchair access',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty special needs note when declared', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: true,
        specialNeedsNote: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject whitespace-only special needs note when declared', () => {
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: true,
        specialNeedsNote: '   ',
      });
      expect(result.success).toBe(false);
    });

    it('should reject special needs note exceeding 500 characters', () => {
      const longNote = 'a'.repeat(501);
      const result = step4Schema.safeParse({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'NoPreference',
        specialNeedsDeclaration: true,
        specialNeedsNote: longNote,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('valid appointment preferences', () => {
    const validPreferences = ['Morning', 'Afternoon', 'Evening', 'NoPreference'];
    
    validPreferences.forEach((pref) => {
      it(`should accept ${pref}`, () => {
        const result = step4Schema.safeParse({
          applicantType: 'Citizen',
          preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
          testLanguage: 'ar',
          appointmentPreference: pref,
          specialNeedsDeclaration: false,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});