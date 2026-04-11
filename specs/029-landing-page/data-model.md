# Data Model: Professional Government Landing Page

Since this is a purely presentational frontend feature, there are no database or backend entity changes. However, we define the following static TypeScript types for mapping the UI components consistently.

## TypeScript Interfaces (Frontend)

```typescript
// Shared type for routing items from grid components
export interface PlatformActionItem {
  id: string;
  titleKey: string;     // i18n translation key
  descriptionKey: string;
  iconName: string;     // Reference to Lucide icon
  href: string;         // Target route
}

export interface LicenseCategoryInfo {
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  nameKey: string;
  minAge: number;
  highlightKey?: string;
}

export interface WorkflowStep {
  step: number;         // 1 to 6
  titleKey: string;
  descriptionKey: string;
}

export interface StatisticData {
  id: string;
  value: string;        // e.g., "4.2M+"
  labelKey: string;     // Translation key
}

export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}
```

## State Transitions
No persistent state transitions exist. UI states (hover, disclosure open/close) are handled temporarily in memory by Framer Motion and Radix UI.
