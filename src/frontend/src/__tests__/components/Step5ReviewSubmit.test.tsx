import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Step5ReviewSubmit } from '@/components/domain/application/wizard/steps/Step5ReviewSubmit';
import { NextIntlClientProvider } from 'next-intl';
import { useWizardStore } from '@/stores/wizard-store';
import { useApplicationWizard } from '@/hooks/useApplicationWizard';

jest.mock('@/stores/wizard-store');
jest.mock('@/hooks/useApplicationWizard');

const mockMessages = {
  wizard: {
    step5: {
      title: 'Review & Submit',
      sections: {
        personal: { title: 'Personal Details', fields: { nationalId: 'ID' } },
        service: { title: 'Service Details', fields: { type: 'Type' } },
        category: { title: 'Category Details', fields: { code: 'Code' } },
        details: { title: 'Application Details', fields: { center: 'Center' } },
      },
      declaration: {
        title: 'Declaration',
        text: 'I agree',
        error: 'Required agreement',
      },
      edit: 'Edit',
    },
    nav: {
      submit: 'Submit',
    }
  },
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('Step5ReviewSubmit', () => {
  const submitMock = jest.fn();
  const goToMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWizardStore as unknown as jest.Mock).mockReturnValue({
      step1: { serviceType: 'NewLicense' },
      step2: { categoryCode: 'B' },
      step3: { nationalId: '1234567890' },
      step4: { preferredCenterId: 'center-1' },
      declarationAccepted: false,
      setDeclaration: jest.fn(),
    });

    (useApplicationWizard as jest.Mock).mockReturnValue({
      submit: submitMock,
      goTo: goToMock,
      currentStep: 5,
    });
  });

  it('renders all summary sections with store data', () => {
    renderWithIntl(<Step5ReviewSubmit />);
    
    expect(screen.getByText('NewLicense')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('center-1')).toBeInTheDocument();
  });

  it('navigates to specific step when Edit is clicked', () => {
    renderWithIntl(<Step5ReviewSubmit />);
    
    // There are multiple "Edit" buttons, get the one in the Service section
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(goToMock).toHaveBeenCalledWith(1);
  });

  it('validates declaration checkbox before submission', async () => {
    renderWithIntl(<Step5ReviewSubmit />);
    
    const submitBtn = screen.getByText('Submit');
    fireEvent.click(submitBtn);

    // Should show error and not call submit
    await waitFor(() => {
      expect(screen.getByText('Required agreement')).toBeInTheDocument();
    });
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('calls submit when declaration is checked', async () => {
    renderWithIntl(<Step5ReviewSubmit />);
    
    const checkbox = screen.getByLabelText(/I agree/i);
    fireEvent.click(checkbox);
    
    const submitBtn = screen.getByText('Submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitMock).toHaveBeenCalled();
    });
  });
});
