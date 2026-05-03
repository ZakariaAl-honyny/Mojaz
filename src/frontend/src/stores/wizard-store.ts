import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StepId, WizardState, ServiceType, LicenseCategoryCode } from '@/types/wizard.types';
import { Gender } from '@/lib/enums';
import { genderFromNumber, serviceTypeFromNumber, licenseCategoryFromNumber } from '@/lib/enum-utils';

const initialState = {
  applicationId: null,
  currentStep: 1 as StepId,
  completedSteps: [],
  lastSavedAt: null,
  consecutiveSaveFailures: 0,
  isSaving: false,
  step1: {
    serviceType: null as ServiceType | null,
  },
  step2: {
    categoryCode: null as string | null, // Backend returns "A", "B", etc. as strings
    availableCategories: null as string[] | null, // Filtered categories for upgrade service
  },
  step3: {
    nationalId: '',
    dateOfBirth: '',
    nationality: '',
    gender: Gender.Male,
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    region: '',
  },
  step4: {
    applicantType: 'Citizen' as const,
    preferredCenterId: null as string | null,
    testLanguage: 'ar' as const,
    appointmentPreference: 'Morning' as const,
    specialNeedsDeclaration: false,
    specialNeedsNote: '',
    identityDocument: null as File | null,
    medicalDocument: null as File | null,
  },
  declarationAccepted: false,
  stepValidators: {} as Record<number, { trigger: any; setFocus: any; isValid?: boolean } | null>,
  hasLoadedFromApi: false,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep1: (data) => set((state) => ({ step1: { ...state.step1, ...data } })),
      setStep2: (data) => set((state) => ({ step2: { ...state.step2, ...data } })),
      setStep3: (data) => set((state) => ({ step3: { ...state.step3, ...data } })),
      setStep4: (data) => set((state) => ({ step4: { ...state.step4, ...data } })),
      setDeclaration: (accepted) => set({ declarationAccepted: accepted }),
      
      goTo: (step) => set({ currentStep: step }),
      
      markCompleted: (step) => 
        set((state) => ({ 
          completedSteps: state.completedSteps.includes(step) 
            ? state.completedSteps 
            : [...state.completedSteps, step] 
        })),
        
      setApplicationId: (id) => set({ applicationId: id }),
      setLastSavedAt: (date) => set({ lastSavedAt: date }),
      setSaving: (saving: boolean) => set({ isSaving: saving }),
      
      incrementSaveFailures: () => 
        set((state) => ({ consecutiveSaveFailures: state.consecutiveSaveFailures + 1 })),
        
      resetSaveFailures: () => set({ consecutiveSaveFailures: 0 }),
      
      resetWizard: () => set(initialState),

      setStepValidator: (step, validator) => set((state) => ({
        stepValidators: { ...state.stepValidators, [step]: validator }
      })),

      setHasLoadedFromApi: (value) => set({ hasLoadedFromApi: value }),

      // Load wizard data fetched from API (e.g., after page refresh)
      // Data comes from backend as numeric enum values
      loadFromApi: (data: {
        serviceType?: number | null;
        licenseCategoryCode?: number | string | null;
        nationalId?: string | null;
        dateOfBirth?: string | null;
        nationality?: string | null;
        gender?: number | string | null;
        mobileNumber?: string | null;
        email?: string | null;
        address?: string | null;
        city?: string | null;
        region?: string | null;
        applicantType?: string | null;
        preferredCenterId?: string | number | null;
        testLanguage?: string | null;
        appointmentPreference?: string | null;
        specialNeedsDeclaration?: boolean | null;
        specialNeedsNote?: string | null;
      }) => set((state) => {
        const newStep1 = { ...state.step1 };
        if (data.serviceType !== undefined) {
          newStep1.serviceType = serviceTypeFromNumber(data.serviceType);
        }

        const newStep2 = { ...state.step2 };
        if (data.licenseCategoryCode !== undefined) {
          // Backend returns number (0-5), convert to string like "A", "B"
          if (typeof data.licenseCategoryCode === 'number') {
            const codes = ['A', 'B', 'C', 'D', 'E', 'F'];
            newStep2.categoryCode = codes[data.licenseCategoryCode] ?? null;
          } else {
            newStep2.categoryCode = String(data.licenseCategoryCode);
          }
        }

        const newStep3 = { ...state.step3 };
        if (data.nationalId !== undefined) newStep3.nationalId = data.nationalId ?? '';
        if (data.dateOfBirth !== undefined) newStep3.dateOfBirth = data.dateOfBirth ?? '';
        if (data.nationality !== undefined) newStep3.nationality = data.nationality ?? '';
        if (data.gender !== undefined) {
          // Convert numeric gender from API to Gender enum: 0-2
          const genderNum = typeof data.gender === 'number' ? data.gender : Number(data.gender);
          newStep3.gender = genderFromNumber(genderNum) ?? Gender.Male;
        }
        if (data.mobileNumber !== undefined) newStep3.mobileNumber = data.mobileNumber ?? '';
        if (data.email !== undefined) newStep3.email = data.email ?? '';
        if (data.address !== undefined) newStep3.address = data.address ?? '';
        if (data.city !== undefined) newStep3.city = data.city ?? '';
        if (data.region !== undefined) newStep3.region = data.region ?? '';

        const newStep4 = { ...state.step4 };
        if (data.applicantType !== undefined) newStep4.applicantType = (data.applicantType ?? 'Citizen') as typeof state.step4.applicantType;
        if (data.preferredCenterId !== undefined) newStep4.preferredCenterId = data.preferredCenterId ? String(data.preferredCenterId) : null;
        if (data.testLanguage !== undefined) newStep4.testLanguage = (data.testLanguage ?? 'ar') as typeof state.step4.testLanguage;
        if (data.appointmentPreference !== undefined) newStep4.appointmentPreference = (data.appointmentPreference ?? 'Morning') as typeof state.step4.appointmentPreference;
        if (data.specialNeedsDeclaration !== undefined) newStep4.specialNeedsDeclaration = data.specialNeedsDeclaration ?? false;
        if (data.specialNeedsNote !== undefined) newStep4.specialNeedsNote = data.specialNeedsNote ?? '';

        // Infer current and completed steps
        const completedSteps: StepId[] = [];
        let currentStep: StepId = 1;

        if (newStep1.serviceType !== null) {
          completedSteps.push(1);
          currentStep = 2;
        }
        if (newStep2.categoryCode !== null) {
          completedSteps.push(2);
          currentStep = 3;
        }
        if (newStep3.nationalId !== '') {
          completedSteps.push(3);
          currentStep = 4;
        }
        if (newStep4.preferredCenterId !== null || newStep4.applicantType !== 'Citizen') {
          completedSteps.push(4);
          currentStep = 5;
        }

        return { 
          step1: newStep1, 
          step2: newStep2, 
          step3: newStep3, 
          step4: newStep4,
          completedSteps,
          currentStep,
          hasLoadedFromApi: true
        };
      }),
    }),
    {
      name: 'mojaz-wizard-draft',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        applicationId: state.applicationId,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        step1: state.step1,
        step2: state.step2,
        step3: state.step3,
        step4: state.step4,
        declarationAccepted: state.declarationAccepted,
      }),
    }
  )
);