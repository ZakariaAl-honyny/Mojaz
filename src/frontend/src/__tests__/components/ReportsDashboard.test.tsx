import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next-locales
const mockUseTranslations = jest.fn((namespace: string) => {
  const translations: Record<string, Record<string, Record<string, string>>> = {
    reports: {
      title: 'Reports & Analytics',
      subtitle: 'Real-time insights and operational performance tracking',
      statusDistribution: 'By Status',
      serviceDistribution: 'By Service',
      delayedApplications: 'Delayed',
      testPerformance: 'Test Results',
      branchThroughput: 'Branch Performance',
      employeeActivity: 'Employee Activity',
      issuanceTimeline: 'Issuance Trend',
      export: 'Export CSV',
      exportPdf: 'Export PDF',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
    },
  };
  return (key: string) => {
    const keys = key.split('.');
    let value: Record<string, Record<string, string>> | Record<string, string> | string = translations[namespace];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k] as Record<string, Record<string, string>> | Record<string, string>;
      }
    }
    return value || key;
  };
});

jest.mock('next-locales', () => ({
  useTranslations: mockUseTranslations,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FileDown: () => <div data-testid="file-down" />,
  Download: () => <div data-testid="download" />,
  Filter: () => <div data-testid="filter" />,
  Calendar: () => <div data-testid="calendar" />,
  Search: () => <div data-testid="search" />,
  BarChart3: () => <div data-testid="bar-chart" />,
  PieChart: () => <div data-testid="pie-chart" />,
  TrendingUp: () => <div data-testid="trending-up" />,
  Clock: () => <div data-testid="clock" />,
  AlertTriangle: () => <div data-testid="alert-triangle" />,
  Activity: () => <div data-testid="activity" />,
  Users: () => <div data-testid="users" />,
  FileText: () => <div data-testid="file-text" />,
  FileSpreadsheet: () => <div data-testid="file-spreadsheet" />,
  Loader2: () => <div data-testid="loader" />,
}));

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: () => <div data-testid="pie-chart" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  AreaChart: () => <div data-testid="area-chart" />,
  Area: () => <div data-testid="area" />,
}));

// Import component after mocks
import { ReportsDashboardPage } from '../ReportsDashboard';

describe('ReportsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the page title', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('Reports & Analytics')).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('Real-time insights and operational performance tracking')).toBeInTheDocument();
    });

    it('should render all 7 report tabs', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('By Status')).toBeInTheDocument();
      expect(screen.getByText('By Service')).toBeInTheDocument();
      expect(screen.getByText('Delayed')).toBeInTheDocument();
      expect(screen.getByText('Test Results')).toBeInTheDocument();
      expect(screen.getByText('Branch Performance')).toBeInTheDocument();
      expect(screen.getByText('Employee Activity')).toBeInTheDocument();
      expect(screen.getByText('Issuance Trend')).toBeInTheDocument();
    });

    it('should render export buttons', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });

    it('should render filter section', () => {
      render(<ReportsDashboardPage />);
      // Check for select elements in filters
      expect(screen.getByText('اختر فرع')).toBeInTheDocument();
    });
  });

  describe('Report Tab Navigation', () => {
    it('should switch to status distribution tab', async () => {
      render(<ReportsDashboardPage />);
      const statusTab = screen.getByText('By Status');
      fireEvent.click(statusTab);
      // Verify the chart renders after tab switch
      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      });
    });

    it('should switch to delayed applications tab', async () => {
      render(<ReportsDashboardPage />);
      const delayedTab = screen.getByText('Delayed');
      fireEvent.click(delayedTab);
      await waitFor(() => {
        expect(screen.getByTestId('file-text')).toBeInTheDocument();
      });
    });

    it('should switch to test performance tab', async () => {
      render(<ReportsDashboardPage />);
      const testTab = screen.getByText('Test Results');
      fireEvent.click(testTab);
      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      });
    });

    it('should switch to branch throughput tab', async () => {
      render(<ReportsDashboardPage />);
      const branchTab = screen.getByText('Branch Performance');
      fireEvent.click(branchTab);
      await waitFor(() => {
        expect(screen.getByTestId('trending-up')).toBeInTheDocument();
      });
    });

    it('should switch to employee activity tab', async () => {
      render(<ReportsDashboardPage />);
      const employeeTab = screen.getByText('Employee Activity');
      fireEvent.click(employeeTab);
      await waitFor(() => {
        expect(screen.getByTestId('users')).toBeInTheDocument();
      });
    });

    it('should switch to issuance timeline tab', async () => {
      render(<ReportsDashboardPage />);
      const timelineTab = screen.getByText('Issuance Trend');
      fireEvent.click(timelineTab);
      await waitFor(() => {
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should have date filter inputs', () => {
      render(<ReportsDashboardPage />);
      const dateInputs = document.querySelectorAll('input[type="date"]');
      expect(dateInputs.length).toBe(2);
    });

    it('should have branch selector', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('اختر فرع')).toBeInTheDocument();
    });

    it('should have category selector', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('اختر الفئة')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should render CSV export button', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });

    it('should render PDF export button', () => {
      render(<ReportsDashboardPage />);
      expect(screen.getByText('Export PDF')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should have RTL direction on container', () => {
      render(<ReportsDashboardPage />);
      const container = screen.getByText('Reports & Analytics').closest('div');
      expect(container?.getAttribute('dir')).toBe('rtl');
    });
  });
});