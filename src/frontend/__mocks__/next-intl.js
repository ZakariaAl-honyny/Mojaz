// Mock for next-intl to avoid ESM import issues
const mockUseTranslations = (namespace) => {
  // Simple mock that returns the key or a basic translation
  const translations = {
    // Common translations used in tests
    'step2.category.title': 'License Category',
    'step2.categoryA.title': 'Category A',
    'step2.categoryA.description': 'Motorcycle',
    'step2.categoryB.title': 'Category B',
    'step2.categoryB.description': 'Private Car',
    'step2.categoryC.title': 'Category C',
    'step2.categoryC.description': 'Commercial Vehicle',
    'step2.categoryD.title': 'Category D',
    'step2.categoryD.description': 'Bus',
    'step2.categoryE.title': 'Category E',
    'step2.categoryE.description': 'Heavy Vehicles',
    'step2.categoryF.title': 'Category F',
    'step2.categoryF.description': 'Agricultural Vehicles',
    'step2.yourAge': 'Your age:',
    'step2.unavailable': '{{count}} category(ies) unavailable for your age',
    'step2.minAgeNote': 'Minimum age: {{minAge}} years',
    'wizard.step5.title': 'Review & Submit',
    'common.save': 'Save',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.draft': 'Draft',
    'common.submitted': 'Submitted',
    'common.inReview': 'In Review',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
  };
  
  return (key, params = {}) => {
    // Handle namespaced keys
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let translation = translations[fullKey] || key;
    
    // Replace parameters
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{{${paramKey}}}`, params[paramKey]);
    });
    
    return translation;
  };
};

module.exports = {
  useTranslations: mockUseTranslations,
  useLocale: () => 'en',
};