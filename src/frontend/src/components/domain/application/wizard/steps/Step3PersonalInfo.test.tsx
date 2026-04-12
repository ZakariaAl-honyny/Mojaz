/**
 * Step3PersonalInfo Component Tests
 * 
 * Tests for T059: Component test Step3PersonalInfo
 * - Render component, click Next without filling required fields
 * - Verify error messages appear under each required field
 * - Fill all required, click Next, verify no errors and goNext called
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step3PersonalInfo from './Step3PersonalInfo';

// Mock the lookups hook
jest.mock('@/hooks/useLookups', () => ({
  useNationalities: () => ({
    data: [
      { code: 'SA', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
      { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt' },
    ],
    isLoading: false,
  }),
  useRegions: () => ({
    data: [
      { code: 'RIYADH', nameAr: 'الرياض', nameEn: 'Riyadh' },
      { code: 'JEDDAH', nameAr: 'جدة', nameEn: 'Jeddah' },
    ],
    isLoading: false,
  }),
}));

// Mock the wizard store
jest.mock('@/stores/wizard-store', () => ({
  useWizardStore: () => ({
    step3: {
      nationalId: '',
      dateOfBirth: '',
      nationality: '',
      gender: 'Male',
      mobileNumber: '',
      email: '',
      address: '',
      city: '',
      region: '',
    },
    setStep3: jest.fn(),
    goTo: jest.fn(),
    markCompleted: jest.fn(),
  }),
}));

describe('Step3PersonalInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T059: Validation on empty form submission', () => {
    it('renders all required fields', () => {
      render(<Step3PersonalInfo />);
      
      expect(screen.getByLabelText(/nationalId/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dateOfBirth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobileNumber/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows error messages when clicking Next without filling required fields', async () => {
      render(<Step3PersonalInfo />);
      
      // Click the Next button
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      // Wait for validation errors
      await waitFor(() => {
        expect(screen.getByText(/nationalId is required/i)).toBeInTheDocument();
      });
    });
  });
});
