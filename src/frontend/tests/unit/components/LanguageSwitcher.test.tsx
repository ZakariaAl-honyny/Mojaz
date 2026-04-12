import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

// Mock useLocale and usePathname
const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ 
    push: mockPush,
    replace: mockReplace 
  })
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'ar'
}))

describe('LanguageSwitcher', () => {
  const messages = {
    common: {
      en: 'English',
      ar: 'Arabic'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with current locale', () => {
    render(
      <div>
        <LanguageSwitcher />
      </div>
    )
    
    // Arabic is default, so it should show English toggle or a dropdown
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls router replace when changing language', () => {
    render(
      <div>
        <LanguageSwitcher />
      </div>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    // Should call router.replace to change locale
    expect(mockReplace).toHaveBeenCalled()
  })
})
