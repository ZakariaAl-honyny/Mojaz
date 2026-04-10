import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1ServiceSelection from '@/components/domain/application/wizard/steps/Step1ServiceSelection';
import { NextIntlClientProvider } from 'next-intl';
import { useWizardStore } from '@/stores/wizard-store';
import { ServiceType } from '@/types/wizard.types';

// Mock the store
jest.mock('@/stores/wizard-store', () => ({
  useWizardStore: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    if (key === 'step1') return (k: string) => k;
    return key;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockMessages = {
  wizard: {
    step1: {
      title: 'Select Service',
      description: 'What would you like to do today?',
      newLicense: {
        title: 'New License',
        description: 'Apply for a new driving license',
      },
      renewal: {
        title: 'Renewal',
        description: 'Renew your existing license',
      }
    },
  },
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('Step1ServiceSelection', () => {
  const mockSetStep1 = jest.fn();
  
  const defaultStore = {
    currentStep: 1,
    step1: { serviceType: null },
    setStep1: mockSetStep1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useWizardStore as any).mockImplementation((selector: any) => 
      selector ? selector(defaultStore) : defaultStore
    );
  });

  it('renders correctly', () => {
    renderWithIntl(<Step1ServiceSelection />);
    
    // Check if header rendered (even with raw keys)
    expect(screen.getByText(/service\.title/i)).toBeInTheDocument();
  });

  it('calls setStep1 when a service is selected', () => {
    renderWithIntl(<Step1ServiceSelection />);
    
    // Find the New License issuance card and click it
    // We use the translation key because our mock returns the key
    const newLicenseTitle = screen.getByText('wizard.step1.newLicense.title');
    fireEvent.click(newLicenseTitle);

    expect(mockSetStep1).toHaveBeenCalled();
  });

  it('registers form on window object', () => {
    renderWithIntl(<Step1ServiceSelection />);
    expect((window as any).__step1Form).toBeDefined();
    expect(typeof (window as any).__step1Form.trigger).toBe('function');
  });
});
