import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardProgressBar } from '@/components/domain/application/wizard/WizardProgressBar';
import { NextIntlClientProvider } from 'next-intl';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';

// Mock the wizard hook
jest.mock('@/hooks/useApplicationWizard');

const mockMessages = {
  wizard: {
    steps: {
      '1': 'Step 1',
      '2': 'Step 2',
      '3': 'Step 3',
      '4': 'Step 4',
      '5': 'Step 5',
    },
  },
};

const renderWithIntl = (component: React.ReactNode, direction: 'ltr' | 'rtl' = 'ltr') => {
  return render(
    <NextIntlClientProvider locale={direction === 'rtl' ? 'ar' : 'en'} messages={mockMessages}>
      <div dir={direction}>
        {component}
      </div>
    </NextIntlClientProvider>
  );
};

describe('WizardProgressBar', () => {
  const goToMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useApplicationWizard as jest.Mock).mockReturnValue({
      currentStep: 1,
      completedSteps: [],
      goTo: goToMock,
    });
  });

  it('renders all 5 steps', () => {
    renderWithIntl(<WizardProgressBar />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 5')).toBeInTheDocument();
  });

  it('allows clicking completed steps', () => {
    (useApplicationWizard as jest.Mock).mockReturnValue({
      currentStep: 3,
      completedSteps: [1, 2],
      goTo: goToMock,
    });

    renderWithIntl(<WizardProgressBar />);
    
    const step1Button = screen.getByText('1').closest('button');
    fireEvent.click(step1Button!);
    expect(goToMock).toHaveBeenCalledWith(1);
  });

  it('disables clicking future steps', () => {
    (useApplicationWizard as jest.Mock).mockReturnValue({
      currentStep: 1,
      completedSteps: [],
      goTo: goToMock,
    });

    renderWithIntl(<WizardProgressBar />);
    
    const step3Button = screen.getByText('3').closest('button');
    expect(step3Button).toBeDisabled();
    
    fireEvent.click(step3Button!);
    expect(goToMock).not.toHaveBeenCalled();
  });

  it('renders correctly in RTL', () => {
    const { container } = renderWithIntl(<WizardProgressBar />, 'rtl');
    const nav = container.querySelector('nav');
    expect(nav?.parentElement).toHaveAttribute('dir', 'rtl');
    // In actual browser, flex-row swap would happen, but in RTL layout testing 
    // we can check if the dir attribute is correctly propagated or specific RTL classes are applied
  });
});
