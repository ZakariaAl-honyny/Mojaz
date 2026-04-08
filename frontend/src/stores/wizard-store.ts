import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StepId, WizardState, ServiceType, LicenseCategoryCode } from '@/types/wizard.types';

const initialState = {
  applicationId: null,
  currentStep: 1 as StepId,
  completedSteps: [],
  lastSavedAt: null,
  consecutiveSaveFailures: 0,
  step1: {
    serviceType: null,
  },
  step2: {
    categoryCode: null,
  },
  step3: {
    nationalId: '',
    dateOfBirth: '',
    nationality: '',
    gender: 'Male' as const,
    mobileNumber: '',
    email: '',
    address: '',
    city: '',
    region: '',
  },
  step4: {
    applicantType: 'Citizen' as const,
    preferredCenterId: '',
    testLanguage: 'ar' as const,
    appointmentPreference: 'Morning' as const,
    specialNeedsDeclaration: false,
    specialNeedsNote: '',
  },
  declarationAccepted: false,
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
      
      incrementSaveFailures: () => 
        set((state) => ({ consecutiveSaveFailures: state.consecutiveSaveFailures + 1 })),
        
      resetSaveFailures: () => set({ consecutiveSaveFailures: 0 }),
      
      resetWizard: () => set(initialState),
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
      }),
    }
  )
);
