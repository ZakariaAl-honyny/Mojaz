import React from 'react';
import { render, screen } from '@testing-library/react';
import { WizardShell } from '@/components/domain/application/wizard/WizardShell';
import { NextIntlClientProvider } from 'next-intl';
import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';
import { useParams } from 'next/navigation';

// Mock child components to keep unit test focused
jest.mock('@/components/domain/application/wizard/WizardProgressBar', () => ({
  WizardProgressBar: () => <div data-testid="progress-bar" />,
}));
jest.mock('@/components/domain/application/wizard/WizardNavButtons', () => ({
  WizardNavButtons: () => <div data-testid="nav-buttons" />,
}));
jest.mock('@/components/domain/application/wizard/steps/Step1ServiceSelection', () => () => <div data-testid="step-1" />);
jest.mock('@/components/domain/application/wizard/steps/Step2LicenseCategory', () => ({
  Step2LicenseCategory: () => <div data-testid="step-2" />,
}));
jest.mock('@/components/domain/application/wizard/steps/Step3PersonalInfo', () => () => <div data-testid="step-3" />);
jest.mock('@/components/domain/application/wizard/steps/Step4ApplicationDetails', () => () => <div data-testid="step-4" />);
jest.mock('@/components/domain/application/wizard/steps/Step5ReviewSubmit', () => ({
  Step5ReviewSubmit: () => <div data-testid="step-5" />,
}));
jest.mock('@/components/domain/application/wizard/shared/AutoSaveIndicator', () => ({
  AutoSaveIndicator: () => <div data-testid="auto-save-indicator" />,
}));
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock hooks
jest.mock('@/stores/wizard-store');
jest.mock('@/hooks/useApplicationWizard');
jest.mock('@/hooks/useWizardAutoSave', () => ({
  useWizardAutoSave: jest.fn(),
}));
jest.mock('next/navigation');

const mockMessages = {};

describe('WizardShell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ locale: 'en' });
    (useApplicationWizard as jest.Mock).mockReturnValue({
      goTo: jest.fn(),
      direction: 1,
    });
  });

  it('renders ProgressBar, AutoSaveIndicator, and NavButtons', () => {
    (useWizardStore as any).mockReturnValue({ currentStep: 1, isSaving: false });
    
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <WizardShell />
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('nav-buttons')).toBeInTheDocument();
  });

  it('renders Step 1 component when currentStep is 1', () => {
    (useWizardStore as any).mockReturnValue({ currentStep: 1, isSaving: false });
    
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <WizardShell />
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('renders Step 2 component when currentStep is 2', () => {
    (useWizardStore as any).mockReturnValue({ currentStep: 2, isSaving: false });
    
    render(
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <WizardShell />
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });
});
