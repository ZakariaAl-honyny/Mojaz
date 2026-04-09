import { createStep2Schema, calculateAge } from '@/lib/validations/step2Schema';
import { LicenseCategoryCode } from '@/types/wizard.types';

describe('step2Schema', () => {
  const minAgeMap: Record<LicenseCategoryCode, number> = {
    [LicenseCategoryCode.A]: 16,
    [LicenseCategoryCode.B]: 18,
    [LicenseCategoryCode.C]: 21,
    [LicenseCategoryCode.D]: 21,
    [LicenseCategoryCode.E]: 21,
    [LicenseCategoryCode.F]: 18,
  };

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const today = new Date();
      const birthDate = `${today.getFullYear() - 25}-01-01`;
      expect(calculateAge(birthDate)).toBe(25);
    });

    it('should handle birthday not yet passed this year', () => {
      const today = new Date();
      const birthDate = `${today.getFullYear() - 20}-12-31`;
      const age = calculateAge(birthDate);
      expect(age).toBeLessThanOrEqual(20);
    });
  });

  describe('validation', () => {
    it('should accept a valid category code', () => {
      const schema = createStep2Schema('2000-01-01', minAgeMap);
      const result = schema.safeParse({ categoryCode: LicenseCategoryCode.B });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid category code', () => {
      const schema = createStep2Schema('2000-01-01', minAgeMap);
      const result = schema.safeParse({ categoryCode: 'X' });
      expect(result.success).toBe(false);
    });

    it('should reject missing categoryCode', () => {
      const schema = createStep2Schema('2000-01-01', minAgeMap);
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('age validation', () => {
    it('should reject category requiring higher age', () => {
      // 16 year old trying to get Category B (requires 18)
      const youngDob = new Date();
      youngDob.setFullYear(youngDob.getFullYear() - 16);
      const dobString = youngDob.toISOString().split('T')[0];
      
      const schema = createStep2Schema(dobString, minAgeMap);
      const result = schema.safeParse({ categoryCode: LicenseCategoryCode.B });
      expect(result.success).toBe(false);
    });

    it('should accept category for valid age', () => {
      // 20 year old trying to get Category B (requires 18)
      const olderDob = new Date();
      olderDob.setFullYear(olderDob.getFullYear() - 20);
      const dobString = olderDob.toISOString().split('T')[0];
      
      const schema = createStep2Schema(dobString, minAgeMap);
      const result = schema.safeParse({ categoryCode: LicenseCategoryCode.B });
      expect(result.success).toBe(true);
    });

    it('should pass validation when no DOB provided', () => {
      const schema = createStep2Schema(undefined, minAgeMap);
      const result = schema.safeParse({ categoryCode: LicenseCategoryCode.B });
      expect(result.success).toBe(true);
    });
  });
});