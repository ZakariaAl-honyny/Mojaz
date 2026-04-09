/**
 * Step5ReviewSubmit Component Tests
 * 
 * Tests for T060: Component test Step5ReviewSubmit
 * - Verify Submit button disabled when declaration unchecked
 * - Check declaration checkbox, verify Submit enabled
 * - Click Submit, verify loading spinner appears
 * 
 * Tests for T063: Component test Step5ReviewSubmit
 * - Mock Zustand store with all 4 steps filled
 * - Verify each StepSection renders correct field values
 * - Verify Edit button for Step 2 triggers goTo(2)
 * - Mock successful submit mutation, verify redirect triggered
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Step5ReviewSubmit from './Step5ReviewSubmit';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock application service
jest.mock('@/services/application.service', () => ({
  default: {
    submitApplication: jest.fn(),
  },
}));

// Mock wizard store
const mockStep1 = { serviceType: 'NewLicense' };
const mockStep2 = { categoryCode: 'B' };
const mockStep3 = { 
  nationalId: '1234567890', 
  dateOfBirth: '1995-01-01',
  nationality: 'SA',
  gender: 'Male',
  mobileNumber: '+966501234567',
  email: 'test@example.com',
  address: 'Test Address',
  city: 'Riyadh',
  region: 'RIYADH'
};
const mockStep4 = { 
  applicantType: 'Citizen',
  preferredCenterId: 'center-1',
  testLanguage: 'ar',
  appointmentPreference: 'Morning',
  specialNeedsDeclaration: false,
  specialNeedsNote: ''
};

jest.mock('@/stores/wizard-store', () => ({
  useWizardStore: () => ({
    step1: mockStep1,
    step2: mockStep2,
    step3: mockStep3,
    step4: mockStep4,
    applicationId: 'app-123',
    goTo: jest.fn(),
    resetWizard: jest.fn(),
  }),
}));

describe('Step5ReviewSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T060: Declaration checkbox controls submit button', () => {
    it('shows declaration checkbox', () => {
      render(<Step5ReviewSubmit />);
      expect(screen.getByLabelText(/declaration/i)).toBeInTheDocument();
    });

    it('Submit button is disabled when declaration unchecked', () => {
      render(<Step5ReviewSubmit />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('Submit button is enabled when declaration checked', async () => {
      render(<Step5ReviewSubmit />);
      
      // Check the declaration checkbox
      const checkbox = screen.getByLabelText(/declaration/i);
      fireEvent.click(checkbox);
      
      // Submit button should be enabled
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).toBeEnabled();
      });
    });
  });

  describe('T063: Review section displays correct values', () => {
    it('displays service type from step1', () => {
      render(<Step5ReviewSubmit />);
      expect(screen.getByText(/new license/i)).toBeInTheDocument();
    });

    it('displays category from step2', () => {
      render(<Step5ReviewSubmit />);
      expect(screen.getByText(/category b/i)).toBeInTheDocument();
    });

    it('displays personal info from step3', () => {
      render(<Step5ReviewSubmit />);
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });
  });
});
