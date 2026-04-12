// Mock for next-intl
export const useTranslations = (namespace?: string) => {
  return (key: string) => key;
};

export const useLocale = () => 'ar';

export const useFormatter = () => ({
  format: (value: unknown) => String(value),
});

export const useMessages = () => ({});

export const NextIntlClientProvider = ({ children }: { children: React.ReactNode }) => children;

export const useNow = () => new Date();

export const useTimeZone = () => 'Asia/Riyadh';