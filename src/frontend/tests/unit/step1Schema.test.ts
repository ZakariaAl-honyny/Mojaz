import { step1Schema } from '@/lib/validations/step1Schema';
import { ServiceType } from '@/types/wizard.types';

describe('step1Schema', () => {
  describe('validation', () => {
    it('should accept a valid service type', () => {
      const result = step1Schema.safeParse({ serviceType: ServiceType.NewLicense });
      expect(result.success).toBe(true);
    });

    it('should reject an invalid service type', () => {
      const result = step1Schema.safeParse({ serviceType: 'InvalidType' });
      expect(result.success).toBe(false);
    });

    it('should reject missing serviceType', () => {
      const result = step1Schema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject null serviceType', () => {
      const result = step1Schema.safeParse({ serviceType: null });
      expect(result.success).toBe(false);
    });
  });

  describe('all service types', () => {
    const serviceTypes = [
      ServiceType.NewLicense,
      ServiceType.Renewal,
      ServiceType.Replacement,
      ServiceType.CategoryUpgrade,
      ServiceType.TestRetake,
      ServiceType.AppointmentBooking,
      ServiceType.Cancellation,
      ServiceType.DocumentDownload,
    ];

    serviceTypes.forEach((serviceType) => {
      it(`should accept ${serviceType}`, () => {
        const result = step1Schema.safeParse({ serviceType });
        expect(result.success).toBe(true);
      });
    });
  });
});