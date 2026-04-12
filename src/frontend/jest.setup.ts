import '@testing-library/jest-dom'

// Mock next-intl
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useTranslations: () => (key: string) => key,
  useLocale: () => 'ar',
  useFormatter: () => ({ format: (s: string) => s }),
  useMessages: () => ({}),
}))
