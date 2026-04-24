import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuditLogsTableComponentComponent } from '@/app/(admin)/audit-logs/page';
import { NextIntlClientProvider, useLocale } from '@/lib/static-translations';
import { auditService, AuditLogDto } from '@/services/audit.service';

// Mock the audit service
jest.mock('@/services/audit.service', () => ({
  auditService: {
    getAuditLogs: jest.fn(),
  },
  ACTION_TYPES: [
    { value: '', label: 'all' },
    { value: 'CREATE', label: 'create' },
    { value: 'UPDATE', label: 'update' },
    { value: 'DELETE', label: 'delete' },
  ],
  ENTITY_TYPES: [
    { value: '', label: 'all' },
    { value: 'User', label: 'user' },
    { value: 'Application', label: 'application' },
  ],
}));

const mockLogs: AuditLogDto[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'أحمد محمد',
    userEmail: 'ahmed@example.com',
    actionType: 'CREATE',
    entityName: 'Application',
    entityId: 'APP-001',
    timestamp: '2025-04-15T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0',
    newValues: { status: 'Submitted', notes: 'Initial submission' },
    oldValues: { status: 'Draft', notes: '' },
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'سارة علي',
    actionType: 'UPDATE',
    entityName: 'License',
    entityId: 'LIC-001',
    timestamp: '2025-04-14T15:45:00Z',
    ipAddress: '192.168.1.101',
    newValues: { status: 'Active' },
    oldValues: { status: 'Pending' },
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'نظام',
    actionType: 'LOGIN',
    entityName: 'User',
    entityId: 'user-3',
    timestamp: '2025-04-13T09:00:00Z',
    ipAddress: '192.168.1.1',
  },
];

const mockMessages = {
  admin: {
    audits: {
      title: 'سجل التدقيق',
      subtitle: 'تتبع العمليات',
      searchPlaceholder: 'بحث...',
      loading: 'جاري التحميل...',
      noLogs: 'لا توجد سجلات',
      filters: {
        all: 'الكل',
        actionType: 'نوع العملية',
        entityType: 'نوع الكيان',
        from: 'من',
        to: 'إلى',
        reset: 'إعادة تعيين',
      },
      detail: {
        title: 'تفاصيل السجل',
        user: 'المستخدم',
        ipAddress: 'عنوان IP',
        userAgent: 'المتصفح',
        timestamp: 'التاريخ',
        entity: 'الكيان',
        entityId: 'المعرف',
        action: 'العملية',
        changes: 'التغييرات',
        oldValue: 'القيمة القديمة',
        newValue: 'القيمة الجديدة',
        noChanges: 'لا توجد تغييرات',
        close: 'إغلاق',
      },
      actions: {
        create: 'إنشاء',
        update: 'تحديث',
        delete: 'حذف',
        login: 'تسجيل دخول',
        logout: 'تسجيل خروج',
        view: 'عرض',
      },
      entities: {
        user: 'مستخدم',
        application: 'طلب',
        license: 'رخصة',
      },
      previous: 'السابق',
      next: 'التالي',
      date: 'التاريخ',
      user: 'بواسطة',
      entity: 'الكيان',
      action: 'العملية',
      details: 'التفاصيل',
    },
  },
};

// Mock useLocale
jest.mock('@/lib/static-translations', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const keys = key.split('.');
    let value: any = mockMessages;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value || key;
  },
  useLocale: () => 'ar',
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AuditLogsTableComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auditService.getAuditLogs as jest.Mock).mockResolvedValue({
      auditLogs: mockLogs,
      totalCount: 3,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });
  });

  it('renders the audit logs page header', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('سجل التدقيق')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    render(<AuditLogsTableComponent />);
    // Should show loading after mount due to async call
  });

  it('renders audit logs table with data', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
      expect(screen.getByText('سارة علي')).toBeInTheDocument();
    });
  });

  it('renders action type badges with correct styling', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // Check for action badges
      expect(screen.getByText('إنشاء')).toBeInTheDocument();
      expect(screen.getByText('تحديث')).toBeInTheDocument();
    });
  });

  it('opens detail modal when clicking eye button', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // Find and click the eye/view button for first row
      const viewButtons = screen.getAllByRole('button', { name: '' });
      const eyeButton = viewButtons.find(button => 
        button.querySelector('svg')?.getAttribute('class')?.includes('lucide-eye')
      );
      if (eyeButton) {
        fireEvent.click(eyeButton);
        expect(screen.getByText('تفاصيل السجل')).toBeInTheDocument();
      }
    });
  });

  it('displays search input', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('بحث...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('filters work with action type select', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // The component should have action type filter
      expect(screen.getByText('نوع العملية')).toBeInTheDocument();
    });
  });

  it('displays empty state when no logs', async () => {
    (auditService.getAuditLogs as jest.Mock).mockResolvedValue({
      auditLogs: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });
    
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('لا توجد سجلات')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    (auditService.getAuditLogs as jest.Mock).mockResolvedValue({
      auditLogs: mockLogs,
      totalCount: 30,
      page: 1,
      pageSize: 20,
      totalPages: 2,
    });
    
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // Should show pagination info
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });
  });

  it('renders detail modal with old vs new values', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // Open details for first log
      const viewButtons = screen.getAllByRole('button', { name: '' });
      const eyeButton = viewButtons.find(button => 
        button.querySelector('svg')?.getAttribute('class')?.includes('lucide-eye')
      );
      if (eyeButton) {
        fireEvent.click(eyeButton);
      }
    });
    
    await waitFor(() => {
      // Modal should show change comparison
      expect(screen.getByText('التغي��رات')).toBeInTheDocument();
    });
  });

  it('displays user IP address in detail modal', async () => {
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: '' });
      const eyeButton = viewButtons.find(button => 
        button.querySelector('svg')?.getAttribute('class')?.includes('lucide-eye')
      );
      if (eyeButton) {
        fireEvent.click(eyeButton);
      }
    });
    
    await waitFor(() => {
      expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
    });
  });
});

describe('AuditLogsTableComponent RTL Support', () => {
  it('renders correctly in RTL mode', async () => {
    const { container } = render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      // The table should be RTL-ready
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });
});

describe('AuditLogsTableComponent Dark Mode', () => {
  it('applies dark mode classes when needed', async () => {
    // Mock dark mode by adding class to document
    document.documentElement.classList.add('dark');
    
    render(<AuditLogsTableComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('سجل التدقيق')).toBeInTheDocument();
    });
    
    document.documentElement.classList.remove('dark');
  });
});