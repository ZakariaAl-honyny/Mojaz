# [i18n] Translate Reports & Employee Module

## Overview

Translate hardcoded text in reports and employee components (manager-dashboard, employee queue, columns, charts).

## CRITICAL RULE

> **You are ONLY allowed to modify these files:**
> - `src/frontend/src/locales/ar/reports.json`
> - `src/frontend/src/locales/en/reports.json`
> - `src/frontend/src/locales/ar/dashboard.json`
> - `src/frontend/src/locales/en/dashboard.json`
> 
> **Do NOT touch any other JSON files. Do NOT modify any TSX/TS files.**

## Hardcoded Text Found

### BranchEfficiencyMap.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 38 | `"Approval Rate"` | `reports.branch.approvalRate` |
| 42 | `"Avg. Time"` | `reports.branch.avgTime` |
| 43 | `"days"` | `reports.branch.days` |

### EmployeeProductivityTable.tsx (3 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 33 | `"Employee"` | `reports.table.employee` |
| 34 | `"Role"` | `reports.table.role` |
| 35 | `"Processed"` | `reports.table.processed` |

### DelayedAppsTable.tsx (1 string)
| Line | Text | Suggested Key |
|------|------|---------------|
| 50 | `"Loading..."` | `common.loading` |

### manager-dashboard.tsx (11 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 91 | `نظرة عامة على الأنظمة` | `dashboard.manager.title` |
| 93 | `تقارير الذكاء التشغيلي والتحليلات المباشرة.` | `dashboard.manager.subtitle` |
| 103 | `+12% زيادة تشغيلية` | `dashboard.manager.kpis.loadTrend` |
| 112 | `معدل كفاءة ممتاز` | `dashboard.manager.kpis.excellentRate` |
| 118 | `طلبات متعثرة` | `dashboard.manager.kpis.stalled` |
| 120 | `بحاجة لتدخل إداري` | `dashboard.manager.kpis.needsAdmin` |
| 126 | `نقاط النشاط` | `dashboard.manager.kpis.activityPoints` |
| 128 | `تفاعلات حيّة حالياً` | `dashboard.manager.kpis.liveInteractions` |
| 150 | `تحليل العمليات الأسبوعي` | `dashboard.manager.charts.weeklyAnalysis` |
| 154 | `بيانات مباشرة` | `dashboard.manager.charts.liveData` |
| 181 | `موثوقية البيانات` | `dashboard.manager.dataReliability` |

### employee-application-queue.tsx (5 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 85 | `البحث برقم الطلب أو اسم مقدم الطلب...` | `employee.queue.searchPlaceholder` |
| 95 | `فلترة متقدمة` | `employee.queue.advancedFilter` |
| 151 | `لا توجد نتائج مطابقة لبحثك.` | `employee.queue.noResults` |
| 164 | `سجلات مكتشفة` | `employee.queue.recordsFound` |
| 164 | `إجمالي` | `employee.queue.total` |

### columns.tsx (7 strings)
| Line | Text | Suggested Key |
|------|------|---------------|
| 13 | `رقم الطلب` | `employee.queue.columns.applicationNumber` |
| 29 | `مقدم الطلب` | `employee.queue.columns.applicantName` |
| 38 | `الفئة` | `employee.queue.columns.category` |
| 41 | `فئة ` | `employee.queue.columns.categoryPrefix` |
| 47 | `المرحلة` | `employee.queue.columns.stage` |
| 57 | `الحالة` | `employee.queue.columns.status` |
| 64 | `تاريخ التقديم` | `employee.queue.columns.submittedDate` |

## Translation Structure Required

Add to `ar/reports.json` and `en/reports.json`:

```json
{
  "branch": {
    "approvalRate": "معدل القبول",
    "avgTime": "متوسط الوقت",
    "days": "أيام"
  },
  "table": {
    "employee": "الموظف",
    "role": "الدور",
    "processed": "المعالج"
  }
}
```

Add to `ar/dashboard.json` and `en/dashboard.json`:

```json
{
  "manager": {
    "title": "نظرة عامة على الأنظمة",
    "subtitle": "تقارير الذكاء التشغيلي والتحليلات المباشرة.",
    "kpis": {
      "loadTrend": "+{value}% زيادة تشغيلية",
      "excellentRate": "معدل كفاءة ممتاز",
      "stalled": "طلبات متعثرة",
      "needsAdmin": "بحاجة لتدخل إداري",
      "activityPoints": "نقاط النشاط",
      "liveInteractions": "تفاعلات حيّة حالياً"
    },
    "charts": {
      "weeklyAnalysis": "تحليل العمليات الأسبوعي",
      "liveData": "بيانات مباشرة"
    },
    "dataReliability": "موثوقية البيانات"
  }
}
```

Create new `ar/employee.json` and `en/employee.json`:

```json
{
  "queue": {
    "searchPlaceholder": "البحث برقم الطلب أو اسم مقدم الطلب...",
    "advancedFilter": "فلترة متقدمة",
    "noResults": "لا توجد نتائج مطابقة لبحثك.",
    "recordsFound": "سجلات مكتشفة",
    "total": "إجمالي",
    "columns": {
      "applicationNumber": "رقم الطلب",
      "applicantName": "مقدم الطلب",
      "category": "الفئة",
      "categoryPrefix": "فئة ",
      "stage": "المرحلة",
      "status": "الحالة",
      "submittedDate": "تاريخ التقديم"
    }
  }
}
```

## Verification

After completing translations:
1. Run `npm run build` to verify no errors
2. Check reports and employee pages render correctly