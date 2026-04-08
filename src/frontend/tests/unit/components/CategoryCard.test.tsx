import { render, screen, fireEvent } from "@testing-library/react";
import CategoryCard from "@/components/domain/application/wizard/shared/CategoryCard";
import { LicenseCategoryCode } from "@/types/wizard.types";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, any>) => {
    const translations: Record<string, string> = {
      "step2.categoryA.title": "Category A",
      "step2.categoryA.description": "Motorcycle",
      "step2.categoryA.ageNote": "Minimum age: {{minAge}} years",
      "step2.categoryB.title": "Category B",
      "step2.categoryB.description": "Private Car",
      "step2.categoryB.ageNote": "Minimum age: {{minAge}} years",
      "step2.disabledTooltip": "Minimum age required: {{minAge}} years for {{category}}",
    };
    let text = translations[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  },
  useLocale: () => "en",
}));

// Individual props for CategoryCard component
const mockCategoryProps = {
  code: LicenseCategoryCode.A,
  nameAr: "الفئة أ",
  nameEn: "Category A",
  descriptionAr: "دراجة نارية",
  descriptionEn: "Motorcycle",
  minAge: 16,
  iconName: "motorcycle",
};

const renderWithProvider = (component: React.ReactNode) => {
  return render(component);
};

describe("CategoryCard", () => {
  it("renders with correct category info", () => {
    const onClick = jest.fn();
    renderWithProvider(
      <CategoryCard
        {...mockCategoryProps}
        selected={false}
        disabled={false}
        onClick={onClick}
      />
    );

    expect(screen.getByText("Category A")).toBeInTheDocument();
    expect(screen.getByText("Motorcycle")).toBeInTheDocument();
  });

  it("shows age when not disabled", () => {
    const onClick = jest.fn();
    renderWithProvider(
      <CategoryCard
        {...mockCategoryProps}
        selected={false}
        disabled={false}
        onClick={onClick}
      );
    );

    expect(screen.getByText(/16\+/)).toBeInTheDocument();
  });

  it("calls onClick when clicked and not disabled", () => {
    const onClick = jest.fn();
    renderWithProvider(
      <CategoryCard
        {...mockCategoryProps}
        selected={false}
        disabled={false}
        onClick={onClick}
      );
    );

    fireEvent.click(screen.getByText("Category A"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = jest.fn();
    renderWithProvider(
      <CategoryCard
        {...mockCategoryProps}
        selected={false}
        disabled={true}
        onClick={onClick}
      );
    );

    fireEvent.click(screen.getByText("Category A"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows selected state correctly", () => {
    const onClick = jest.fn();
    renderWithProvider(
      <CategoryCard
        {...mockCategoryProps}
        selected={true}
        disabled={false}
        onClick={onClick}
      );
    );

    // Check for selected class (border-primary-500)
    const cardElement = screen.getByText("Category A")
      .closest("div");
    expect(cardElement?.className).toContain("border-primary-500");
  });
});