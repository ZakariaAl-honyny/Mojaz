import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Ensure that a valid locale is used
  let locale = await requestLocale;

  // Fallback to default locale if not provided or invalid
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Import messages dynamically based on locale
    messages: (await import(`../../public/locales/${locale}.json`)).default
  };
});
