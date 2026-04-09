import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryCard from '@/components/domain/application/wizard/shared/CategoryCard';
import { NextIntlClientProvider } from 'next-intl';
import { LicenseCategoryCode } from '@/types/wizard.types';

const mockMessages = {
  wizard: {
    step2: {
      categories: {
        B: {
          title: 'Private Vehicle',
          description: 'Description for Category B',
        },
      },
    },
  },
};

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      {component}
    </NextIntlClientProvider>
  );
};

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
}));

describe('CategoryCard', () => {
  const defaultProps = {
    code: LicenseCategoryCode.B,
    nameAr: 'سيارة خاصة',
    nameEn: 'Private Vehicle',
    descriptionAr: 'وصف الفئة ب',
    descriptionEn: 'Description for Category B',
    minAge: 18,
    selected: false,
    onClick: jest.fn(),
  };

  it('renders title and description based on locale', () => {
    renderWithIntl(<CategoryCard {...defaultProps} />);

    expect(screen.getByText('Private Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Description for Category B')).toBeInTheDocument();
    expect(screen.getByText('18+')).toBeInTheDocument();
  });

  it('shows selected state with check icon', () => {
    renderWithIntl(<CategoryCard {...defaultProps} selected={true} />);

    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    // In our implementation, selected state adds primary classes to the container
    const card = screen.getByText('B').closest('.border-primary-500');
    expect(card).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    const onClick = jest.fn();
    renderWithIntl(<CategoryCard {...defaultProps} disabled={true} onClick={onClick} />);

    const card = screen.getByText('B').closest('.cursor-not-allowed');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('grayscale');

    fireEvent.click(screen.getByText('Private Vehicle'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls onClick when not disabled', () => {
    const onClick = jest.fn();
    renderWithIntl(<CategoryCard {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByText('Private Vehicle'));
    expect(onClick).toHaveBeenCalled();
  });
});
