import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Step4ApplicationDetails from '@/components/domain/application/wizard/steps/Step4ApplicationDetails';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWizardStore } from '@/stores/wizard-store';
import ApplicationService from '@/services/application.service';

// Mock the store
jest.mock('@/stores/wizard-store', () => ({
  useWizardStore: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => (k: string) => k,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the service
jest.mock('@/services/application.service', () => ({
  getExamCenters: jest.fn(),
}));

const mockMessages = {
  wizard: {
    step4: {
      title: 'Application Details',
      description: 'Provide more details about your application',
      applicantType: 'Applicant Type',
      citizen: 'Citizen',
      resident: 'Resident',
      preferredCenter: 'Preferred Exam Center',
      testLanguage: 'Test Language',
      arabic: 'Arabic',
      english: 'English',
      appointmentPreference: 'Appointment Preference',
      morning: 'Morning',
      specialNeedsDeclaration: 'Special Needs Declaration',
      specialNeedsNote: 'Special Needs Note',
      specialNeedsNotePlaceholder: 'Enter details...',
      errors: {
        centersFailed: 'Failed to load centers',
      }
    },
    validation: {
      step4: {
        required: 'This field is required',
      }
    },
    common: {
      select: 'Select...',
      retry: 'Retry',
    }
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        {component}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

describe('Step4ApplicationDetails', () => {
  const mockSetStep4 = jest.fn();
  
  const defaultStore = {
    currentStep: 4,
    step4: {
      applicantType: 'Citizen',
      preferredCenterId: '',
      testLanguage: 'ar',
      appointmentPreference: 'Morning',
      specialNeedsDeclaration: false,
      specialNeedsNote: '',
    },
    setStep4: mockSetStep4,
  };

  const mockCenters = [
    { id: '1', nameEn: 'Riyadh Center', nameAr: 'مركز الرياض', city: 'Riyadh', isActive: true },
    { id: '2', nameEn: 'Jeddah Center', nameAr: 'مركز جدة', city: 'Jeddah', isActive: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useWizardStore as any).mockImplementation((selector: any) => 
      selector ? selector(defaultStore) : defaultStore
    );
    (ApplicationService.getExamCenters as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCenters,
    });
  });

  it('renders centers list after loading', async () => {
    renderWithProviders(<Step4ApplicationDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Riyadh Center - Riyadh')).toBeInTheDocument();
      expect(screen.getByText('Jeddah Center - Jeddah')).toBeInTheDocument();
    });
  });

  it('shows special needs note when checkbox is checked', async () => {
    renderWithProviders(<Step4ApplicationDetails />);
    
    await waitFor(() => {
      const checkbox = screen.getByLabelText('Special Needs Declaration');
      fireEvent.click(checkbox);
      expect(screen.getByText('Special Needs Note')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter details...')).toBeInTheDocument();
    });
  });

  it('calls setStep4 when values change', async () => {
    renderWithProviders(<Step4ApplicationDetails />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('Resident'));
    });

    // useEffect syncs with store
    expect(mockSetStep4).toHaveBeenCalledWith(expect.objectContaining({
      applicantType: 'Resident',
    }));
  });

  it('registers form on window object', async () => {
    renderWithProviders(<Step4ApplicationDetails />);
    await waitFor(() => {
      expect((window as any).__step4Form).toBeDefined();
    });
  });
});
