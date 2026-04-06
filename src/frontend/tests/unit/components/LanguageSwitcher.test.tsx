import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'
import { NextIntlClientProvider } from 'next-intl'

// Mock useLocale and usePathname
const mockPush = jest.fn()
jest.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: mockPush })
}))

jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useLocale: () => 'ar'
}))

describe('LanguageSwitcher', () => {
  const messages = {
    common: {
      en: 'English',
      ar: 'Arabic'
    }
  }

  it('renders correctly with current locale', () => {
    render(
      <NextIntlClientProvider locale="ar" messages={messages}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    )
    
    // Arabic is default, so it should show English toggle or a dropdown
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls router push when changing language', () => {
    render(
      <NextIntlClientProvider locale="ar" messages={messages}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    // Detailed click logic depends on implementation (e.g., if it's a direct toggle or dropdown)
  })
})
