import { step3Schema } from '@/lib/validations/step3Schema';

describe('step3Schema', () => {
  describe('validation', () => {
    it('should accept valid complete data', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        email: 'test@example.com',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short national ID', () => {
      const result = step3Schema.safeParse({
        nationalId: '123',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject long national ID', () => {
      const result = step3Schema.safeParse({
        nationalId: '123456789012345678901',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric national ID', () => {
      const result = step3Schema.safeParse({
        nationalId: '123456789A',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid date of birth', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: 'not-a-date',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing nationality', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: '',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid gender', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Other',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid mobile number', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: 'invalid',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        email: 'not-an-email',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should accept optional email (empty string)', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        email: '',
        address: '123 Main Street',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short address', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: 'abc',
        city: 'Riyadh',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing city', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: '',
        region: 'Central',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing region', () => {
      const result = step3Schema.safeParse({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        address: '123 Main Street',
        city: 'Riyadh',
        region: '',
      });
      expect(result.success).toBe(false);
    });
  });
});