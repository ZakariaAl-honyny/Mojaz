# Feature 002: Frontend Foundation for Mojaz Platform

## WHAT WE'RE BUILDING:
A Next.js 15 application with App Router that serves as the foundation for all frontend development, including theming, i18n, layouts, and API client configuration.

## REQUIREMENTS:

### 1. Next.js 15 Project with App Router:
- TypeScript 5 strict mode
- src/ directory structure
- @/* import alias

### 2. Tailwind CSS 4 + shadcn/ui:
- Custom Mojaz theme colors:
  - Primary: #006C35 (Royal Green) with full shade scale (50-900)
  - Secondary: #D4A017 (Government Gold) with full scale
  - Status: success=#10B981, warning=#F59E0B, error=#EF4444, info=#3B82F6
  - Neutral: standard gray scale
- shadcn/ui initialized with Mojaz theme
- Components installed: Button, Card, Input, Label, Select, Textarea, Checkbox, Dialog, Sheet, DropdownMenu, Table, Badge, Avatar, Toast/Sonner, Alert, Form, Calendar, Accordion, Progress, Skeleton, Breadcrumb, Pagination, NavigationMenu, Sidebar, Tabs, RadioGroup, Switch, Popover, Tooltip, ScrollArea, Separator, Command, AlertDialog, DatePicker

### 3. Internationalization (next-intl 3):
- Locale-based routing: /ar/... and /en/...
- Arabic (RTL) is default locale
- Middleware for locale detection and redirect
- Translation file structure:
  - public/locales/ar/common.json, auth.json, application.json, dashboard.json, navigation.json
  - public/locales/en/... (same structure)
- Initial translations for: navigation items, common actions, auth labels, footer content

### 4. Theme Support (next-themes):
- Dark mode and Light mode
- System preference detection
- Theme persisted in localStorage
- Smooth transition between themes
- All shadcn components support both themes

### 5. Layout System:
- **RootLayout:** sets html lang, dir (rtl/ltr), font class
- **PublicLayout:** header with logo, language/theme switch, login/register, minimal footer
- **ApplicantLayout:** sidebar (right RTL, left LTR), header with breadcrumb/notification bell/user avatar, sidebar menu: Dashboard, My Applications, New Application, Appointments, Payments, Notifications, My License, Profile
- **EmployeeLayout:** similar to ApplicantLayout, sidebar varies by role
- **AdminLayout:** sidebar: Dashboard, Users, Settings, Fees, Audit Logs

### 6. API Client (Axios):
- Base instance with configurable baseURL
- Request interceptor: inject JWT + Accept-Language header
- Response interceptor: handle 401 -> refresh token -> retry; errors -> show toast
- Type-safe wrapper functions

### 7. React Query Provider:
- QueryClient with default options, stale time 5 min, retry 1, DevTools in dev

### 8. Zustand Auth Store:
- State: user, accessToken, refreshToken, isAuthenticated
- Actions: login, logout, setTokens, clearAuth
- Persist to localStorage (tokens only), hydration handling for SSR

### 9. TypeScript Types:
- ApiResponse<T>, PaginatedResult<T>, User types, Common types (SelectOption, TableColumn)

### 10. Utility Functions (lib/utils.ts):
- cn(), formatDate(), formatCurrency(), calculateAge(), getStatusColor(), getInitials()

### 11. Components:
- LoadingSkeleton, EmptyState, ErrorState, PageLoading

### 12. 404 Page:
- Bilingual not-found page with link back to home

## ACCEPTANCE CRITERIA:
- [ ] App loads at localhost:3000 with Arabic RTL layout
- [ ] Language switches instantly between AR and EN
- [ ] Layout direction flips correctly (sidebar, text alignment)
- [ ] Dark/Light mode toggles correctly
- [ ] All shadcn components render in Mojaz theme colors
- [ ] Public layout renders for unauthenticated pages
- [ ] Applicant/Employee/Admin layouts render correctly
- [ ] API client configured with interceptors
- [ ] Auth store persists between page refreshes
- [ ] TypeScript types match backend API contracts
- [ ] 404 page works in both languages
- [ ] Responsive on mobile, tablet, desktop
- [ ] Arabic font (IBM Plex Sans Arabic) loads correctly
- [ ] English font (Inter) loads correctly