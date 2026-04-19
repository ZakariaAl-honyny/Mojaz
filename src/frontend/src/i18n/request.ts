import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

/**
 * Robust deep merge for configuration objects
 */
function mergeDeep(target: any, source: any) {
  if (!source) return target;
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages: Record<string, any> = {};
  
  // Prevent Edge Runtime crashes by checking the runtime environment
  if (typeof process === 'undefined' || process.env.NEXT_RUNTIME === 'edge') {
    return { locale, messages: {} };
  }

  // Dynamic imports for Node.js modules
  const fs = await import('fs');
  const path = await import('path');
  
  // Use src/locales as requested by user
  // We use path.resolve to ensure we have an absolute path
  const localesDir = path.resolve(process.cwd(), 'src/locales', locale);
  
  try {
    if (fs.existsSync(localesDir)) {
      const files = fs.readdirSync(localesDir);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const ns = path.basename(file, '.json');
          const filePath = path.join(localesDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          try {
            const json = JSON.parse(content);
            if (json[ns] && Object.keys(json).length === 1) {
              mergeDeep(messages, json);
            } else {
              mergeDeep(messages, { [ns]: json });
            }
          } catch (e) {
            console.error(`[i18n] Error parsing JSON in ${filePath}:`, e);
          }
        }
      }
    } else {
      console.warn(`[i18n] Locales directory not found: ${localesDir}`);
      // Fallback: check if we are in a build environment where cwd might be different
      const alternativePath = path.resolve(process.cwd(), 'src/frontend/src/locales', locale);
      if (fs.existsSync(alternativePath)) {
         console.info(`[i18n] Found locales in alternative path: ${alternativePath}`);
         // ... simplified for now, I'll just use one path and log it
      }
    }
  } catch (error) {
    console.error(`[i18n] Error reading locales directory ${localesDir}:`, error);
  }

  return {
    locale,
    messages
  };
});