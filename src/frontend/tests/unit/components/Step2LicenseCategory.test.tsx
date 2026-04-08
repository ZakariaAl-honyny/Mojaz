import { render, screen, waitFor } from "@testing-library/react";
import { Step2LicenseCategory } from "@/components/domain/application/wizard/steps/Step2LicenseCategory";

// Mock calculateAge utility
jest.mock("@/lib/utils", () => ({
  calculateAge: (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  },
  cn: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" "),
}));

// Mock useWizardStore
jest.mock("@/stores/wizard-store", () => ({
  useWizardStore: () => ({
    step2: { categoryCode: null },
    step3: { dateOfBirth: "2009-01-15" }, // 17 years old in 2026
    setStep2: jest.fn(),
  }),
}));

// Mock React Query
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

// Mock next-intl - this must come before component import
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
  useLocale: () => "en",
}));

// Mock license categories response
const mockCategories = [
  { code: "A", nameEn: "Category A", nameAr: "الفئة أ", descriptionEn: "Motorcycle", descriptionAr: "دراجة نارية", minAge: 16 },
  { code: "B", nameEn: "Category B", nameAr: "الفئة ب", descriptionEn: "Private Car", descriptionAr: "سيارة خاصة", minAge: 18 },
  { code: "C", nameEn: "Category C", nameAr: "الفئة ج", descriptionEn: "Commercial Vehicle", descriptionAr: "مركبة تجارية", minAge: 21 },
  { code: "D", nameEn: "Category D", nameAr: "الفئة د", descriptionEn: "Bus", descriptionAr: "حافلة", minAge: 21 },
  { code: "E", nameEn: "Category E", nameAr: "الفئة هـ", descriptionEn: "Heavy Vehicles", descriptionAr: "مركبات ثقيلة", minAge: 21 },
  { code: "F", nameEn: "Category F", nameAr: "الفئة و", descriptionEn: "Agricultural Vehicles", descriptionAr: "مركبات زراعية", minAge: 18 },
];

// Import mocks after jest.mock declarations
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";

// Setup translation mock implementation
const mockTranslations: Record<string, string> = {
  "step2.title": "License Category",
  "step2.categoryA.title": "Category A",
  "step2.categoryA.description": "Motorcycle",
  "step2.categoryA.ageNote": "Minimum age: {{minAge}} years",
  "step2.categoryB.title": "Category B",
  "step2.categoryB.description": "Private Car",
  "step2.categoryB.ageNote": "Minimum age: {{minAge}} years",
  "step2.categoryC.title": "Category C",
  "step2.categoryC.description": "Commercial Vehicle",
  "step2.categoryC.ageNote": "Minimum age: {{minAge}} years",
  "step2.categoryD.title": "Category D",
  "step2.categoryD.description": "Bus",
  "step2.categoryD.ageNote": "Minimum age: {{minAge}} years",
  "step2.categoryE.title": "Category E",
  "step2.categoryE.description": "Heavy Vehicles",
  "step2.categoryE.ageNote": "Minimum age: {{minAge}} years",
  "step2.categoryF.title": "Category F",
  "step2.categoryF.description": "Agricultural Vehicles",
  "step2.categoryF.ageNote": "Minimum age: {{minAge}} years",
  "step2.disabledMessage": "{{count}} category(ies) unavailable for your age",
  "step2.disabledTooltip": "Minimum age required: {{minAge}} years for {{category}}",
  "step2.ageError": "Minimum age required: {{minAge}} years",
};

describe("Step2LicenseCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup useTranslations mock
    (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
      return (key: string, params?: Record<string, any>) => {
        let text = mockTranslations[key] || key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{{${k}}}`, String(v));
          });
        }
        return text;
      };
    });

    // Setup useQuery mock
    (useQuery as jest.Mock).mockReturnValue({
      data: mockCategories,
      isLoading: false,
    });
  });

  it("renders the step title", async () => {
    render(<Step2LicenseCategory />);
    
    await waitFor(() => {
      expect(screen.getByText("License Category")).toBeInTheDocument();
    });
  });

  it("shows disabled banner when some categories are disabled", async () => {
    render(<Step2LicenseCategory />);
    
    await waitFor(() => {
      expect(screen.getByText("5 category(ies) unavailable for your age")).toBeInTheDocument();
    });
  });

  it("disables categories B-F for 17-year-old applicant", async () => {
    render(<Step2LicenseCategory />);
    
    await waitFor(() => {
      // Category A should be enabled (minAge 16)
      const categoryAButton = screen.getByText("Category A").closest("button");
      expect(categoryAButton).not.toHaveAttribute("aria-disabled", "true");
      
      // Category B should be disabled (minAge 18, applicant is 17)
      const buttons = screen.getAllByRole("button");
      // Button indices: 0=A, 1=B, 2=C, 3=D, 4=E, 5=F
      expect(buttons[1]).toHaveAttribute("aria-disabled", "true");
      expect(buttons[2]).toHaveAttribute("aria-disabled", "true");
      expect(buttons[3]).toHaveAttribute("aria-disabled", "true");
      expect(buttons[4]).toHaveAttribute("aria-disabled", "true");
      expect(buttons[5]).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("shows age error message for disabled categories", async () => {
    render(<Step2LicenseCategory />);
    
    await waitFor(() => {
      // Check that disabled reason is shown - there are 2 (B and F both have minAge 18)
      expect(screen.getAllByText("Minimum age required: 18 years").length).toBeGreaterThan(0);
    });
  });

  it("renders all 6 category cards", async () => {
    render(<Step2LicenseCategory />);
    
    await waitFor(() => {
      expect(screen.getByText("Category A")).toBeInTheDocument();
      expect(screen.getByText("Category B")).toBeInTheDocument();
      expect(screen.getByText("Category C")).toBeInTheDocument();
      expect(screen.getByText("Category D")).toBeInTheDocument();
      expect(screen.getByText("Category E")).toBeInTheDocument();
      expect(screen.getByText("Category F")).toBeInTheDocument();
    });
  });
});