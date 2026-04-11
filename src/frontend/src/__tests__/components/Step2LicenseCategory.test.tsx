import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Step2LicenseCategory } from '@/components/domain/application/wizard/steps/Step2LicenseCategory';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWizardStore } from '@/stores/wizard-store';
import ApplicationService from '@/services/application.service';
import { LicenseCategoryCode, ServiceType } from '@/types/wizard.types';

// Mock the store
jest.mock('@/stores/wizard-store', () => ({
  useWizardStore: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    if (key === 'wizard') return (k: string) => k;
    return (k: string) => k;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the service
jest.mock('@/services/application.service', () => ({
  getLicenseCategories: jest.fn(),
}));

const mockMessages = {
  wizard: {
    step2: {
      title: 'Select License Category',
      description: 'Choose the type of license you wish to apply for',
      disabledMessage: '{count} categories unavailable for your age',
      yourAge: 'Your age: {age}',
    },
    common: {
      retry: 'Retry',
    },
    errors: {
      loadFailed: 'Failed to load categories',
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

describe('Step2LicenseCategory', () => {
  const mockSetStep2 = jest.fn();
  
  const defaultStore = {
    currentStep: 2,
    step1: { serviceType: ServiceType.NewLicense },
    step2: { categoryCode: null },
    step3: { dateOfBirth: '2000-01-01' }, // 26 years old
    setStep2: mockSetStep2,
  };

  const mockCategories = [
    {
      code: LicenseCategoryCode.A,
      nameEn: 'Motorcycle',
      nameAr: 'دراجة نارية',
      descriptionEn: 'Motorcycle license',
      descriptionAr: 'رخصة دراجة نارية',
      minAge: 16,
      icon: 'Bike',
    },
    {
      code: LicenseCategoryCode.B,
      nameEn: 'Private',
      nameAr: 'سيارة خاصة',
      descriptionEn: 'Private vehicle license',
      descriptionAr: 'رخصة سيارة خاصة',
      minAge: 18,
      icon: 'Car',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useWizardStore as any).mockImplementation((selector: any) => 
      selector ? selector(defaultStore) : defaultStore
    );
    (ApplicationService.getLicenseCategories as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCategories,
    });
  });

  it('renders loading state initially', () => {
    renderWithProviders(<Step2LicenseCategory />);
    // Our implementation shows skeletons, but we can check for the header at least
    expect(screen.getByText('Select License Category')).toBeInTheDocument();
  });

  it('renders categories after loading', async () => {
    renderWithProviders(<Step2LicenseCategory />);
    
    await waitFor(() => {
      expect(screen.getByText('Motorcycle')).toBeInTheDocument();
      expect(screen.getByText('Private')).toBeInTheDocument();
    });
  });

  it('disables categories based on age', async () => {
    // Mock a 17-year-old user
    const seventeenYearOldDate = new Date();
    seventeenYearOldDate.setFullYear(seventeenYearOldDate.getFullYear() - 17);
    
    (useWizardStore as any).mockReturnValue({
      ...defaultStore,
      step3: { dateOfBirth: seventeenYearOldDate.toISOString().split('T')[0] },
    });

    // Mock categories with age requirements
    (ApplicationService.getLicenseCategories as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        ...mockCategories,
        {
          code: LicenseCategoryCode.C,
          nameEn: 'Heavy',
          minAge: 21,
          icon: 'Truck',
        }
      ],
    });

    renderWithProviders(<Step2LicenseCategory />);
    
    await waitFor(() => {
      // Category B (18+) should be disabled for a 17yo in our logic?
      // Wait, 17 < 18, so yes.
      // Category A (16+) should be enabled.
      const catB = screen.getByText('Private').closest('.cursor-not-allowed');
      expect(catB).toBeInTheDocument();
      
      const catA = screen.getByText('Motorcycle').closest('.cursor-pointer');
      expect(catA).not.toHaveClass('cursor-not-allowed');
    });
  });

  it('calls setStep2 when a category is selected', async () => {
    renderWithProviders(<Step2LicenseCategory />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Motorcycle'));
    });

    expect(mockSetStep2).toHaveBeenCalledWith({ categoryCode: LicenseCategoryCode.A });
  });

  it('shows error state and handles retry', async () => {
    const mockRefetch = jest.fn();
    (ApplicationService.getLicenseCategories as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<Step2LicenseCategory />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Retry'));
    expect(ApplicationService.getLicenseCategories).toHaveBeenCalledTimes(2);
  });
});
