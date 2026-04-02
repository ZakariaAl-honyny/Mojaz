---
description: Internationalization and bidirectional text rules
globs: ["src/frontend/**/*.{ts,tsx}", "**/locales/**"]
alwaysApply: false
---

# i18n and RTL/LTR Rules

## Every new component:
1. Import useTranslations
2. Use t('key') for ALL text
3. Add key to BOTH ar and en JSON files
4. Use logical CSS properties
5. Test in Arabic (RTL) layout
6. Test in English (LTR) layout

## Translation File Pattern
```json
// public/locales/ar/{namespace}.json
{
  "section": {
    "title": "العنوان بالعربي",
    "description": "الوصف بالعربي"
  }
}

// public/locales/en/{namespace}.json  
{
  "section": {
    "title": "English Title",
    "description": "English description"
  }
}

CSS Logical Properties Mapping
ml-* → ms-* (margin-inline-start)
mr-* → me-* (margin-inline-end)
pl-* → ps-* (padding-inline-start)
pr-* → pe-* (padding-inline-end)
left-* → start-*
right-* → end-*
text-left → text-start
text-right → text-end