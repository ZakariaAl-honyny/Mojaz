# Phase 1: Quickstart (021-category-f-agricultural)

## Purpose
Implementation of backend configuration, upgrade flows, and specialized high-performance UI for agricultural vehicle licenses (Category F).

## Steps to Execute
1. **Settings / DB**: Ensure `SystemSettings` explicitly define Category F rules (Age 18, 20 hrs training, etc.) within Infrastructure data seeders.
2. **Backend Logic**: Update `ApplicationValidator` to permit F -> B upgrade transitions and reject F -> C/D/E.
3. **Translations**: Add localization keys for F-specific terminology (e.g., "Field Test") in `public/locales/ar/application.json` and `en/application.json`.
4. **UI Components**: Build Category F visual elements integrating distinctive agricultural iconography, satisfying the Vercel reactivity and aesthetic benchmarks set in the specification without introducing client-side layout shifts.
