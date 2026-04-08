import { useWizardStore } from '@/stores/wizard-store';
import { ServiceType, LicenseCategoryCode } from '@/types/wizard.types';

// Mock the sessionStorage for persist middleware
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('wizard-store', () => {
  beforeEach(() => {
    // Reset store before each test
    useWizardStore.getState().resetWizard();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useWizardStore.getState();
      
      expect(state.applicationId).toBeNull();
      expect(state.currentStep).toBe(1);
      expect(state.completedSteps).toEqual([]);
      expect(state.step1.serviceType).toBeNull();
      expect(state.step2.categoryCode).toBeNull();
      expect(state.step3.nationalId).toBe('');
      expect(state.step4.preferredCenterId).toBe('');
      expect(state.declarationAccepted).toBe(false);
    });
  });

  describe('step1 actions', () => {
    it('should update step1 data', () => {
      const { setStep1 } = useWizardStore.getState();
      
      setStep1({ serviceType: ServiceType.NewLicense });
      
      expect(useWizardStore.getState().step1.serviceType).toBe(ServiceType.NewLicense);
    });
  });

  describe('step2 actions', () => {
    it('should update step2 data', () => {
      const { setStep2 } = useWizardStore.getState();
      
      setStep2({ categoryCode: LicenseCategoryCode.B });
      
      expect(useWizardStore.getState().step2.categoryCode).toBe(LicenseCategoryCode.B);
    });
  });

  describe('step3 actions', () => {
    it('should update step3 data', () => {
      const { setStep3 } = useWizardStore.getState();
      
      setStep3({
        nationalId: '1234567890',
        dateOfBirth: '1995-01-15',
        nationality: 'SA',
        gender: 'Male',
        mobileNumber: '+966501234567',
        email: 'test@example.com',
        address: '123 Main St',
        city: 'Riyadh',
        region: 'Central',
      });
      
      const state = useWizardStore.getState();
      expect(state.step3.nationalId).toBe('1234567890');
      expect(state.step3.dateOfBirth).toBe('1995-01-15');
      expect(state.step3.gender).toBe('Male');
    });
  });

  describe('step4 actions', () => {
    it('should update step4 data', () => {
      const { setStep4 } = useWizardStore.getState();
      
      setStep4({
        applicantType: 'Citizen',
        preferredCenterId: '123e4567-e89b-12d3-a456-426614174000',
        testLanguage: 'ar',
        appointmentPreference: 'Morning',
        specialNeedsDeclaration: true,
        specialNeedsNote: 'Test note',
      });
      
      const state = useWizardStore.getState();
      expect(state.step4.applicantType).toBe('Citizen');
      expect(state.step4.specialNeedsDeclaration).toBe(true);
    });
  });

  describe('declaration actions', () => {
    it('should update declaration', () => {
      const { setDeclaration } = useWizardStore.getState();
      
      setDeclaration(true);
      
      expect(useWizardStore.getState().declarationAccepted).toBe(true);
    });
  });

  describe('navigation actions', () => {
    it('should go to specific step', () => {
      const { goTo } = useWizardStore.getState();
      
      goTo(3);
      
      expect(useWizardStore.getState().currentStep).toBe(3);
    });

    it('should mark step as completed', () => {
      const { markCompleted } = useWizardStore.getState();
      
      markCompleted(1);
      markCompleted(2);
      
      expect(useWizardStore.getState().completedSteps).toContain(1);
      expect(useWizardStore.getState().completedSteps).toContain(2);
    });

    it('should not duplicate completed steps', () => {
      const { markCompleted } = useWizardStore.getState();
      
      markCompleted(1);
      markCompleted(1);
      
      expect(useWizardStore.getState().completedSteps).toEqual([1]);
    });
  });

  describe('application ID actions', () => {
    it('should set application ID', () => {
      const { setApplicationId } = useWizardStore.getState();
      
      setApplicationId('app-123');
      
      expect(useWizardStore.getState().applicationId).toBe('app-123');
    });
  });

  describe('reset action', () => {
    it('should reset wizard to initial state', () => {
      const { setStep1, setStep2, setApplicationId, markCompleted, resetWizard } = useWizardStore.getState();
      
      // Make some changes
      setStep1({ serviceType: ServiceType.NewLicense });
      setStep2({ categoryCode: LicenseCategoryCode.B });
      setApplicationId('app-123');
      markCompleted(1);
      
      // Reset
      resetWizard();
      
      const state = useWizardStore.getState();
      expect(state.applicationId).toBeNull();
      expect(state.currentStep).toBe(1);
      expect(state.completedSteps).toEqual([]);
      expect(state.step1.serviceType).toBeNull();
      expect(state.step2.categoryCode).toBeNull();
    });
  });

  describe('save failure tracking', () => {
    it('should track consecutive save failures', () => {
      const { incrementSaveFailures, resetSaveFailures } = useWizardStore.getState();
      
      incrementSaveFailures();
      incrementSaveFailures();
      
      expect(useWizardStore.getState().consecutiveSaveFailures).toBe(2);
      
      resetSaveFailures();
      
      expect(useWizardStore.getState().consecutiveSaveFailures).toBe(0);
    });
  });
});