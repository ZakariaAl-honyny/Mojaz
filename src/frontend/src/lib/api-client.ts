import axios from 'axios';

// ============================================================
// SIMPLIFIED API CLIENT - For Demo Reliability
// ============================================================

// Get token from localStorage OR cookie  
function getToken(): string | null {
  // 1. Try localStorage - check BOTH 'token' and 'accessToken'
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (localToken) {
      console.log('[API] Token found in localStorage');
      return localToken;
    }
  }

  // 2. Try cookie as fallback - check BOTH 'token' and 'accessToken'
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token' || name === 'accessToken') {
        console.log('[API] Token found in cookie:', name);
        return value;
      }
    }
  }

  console.log('[API] No token found');
  return null;
}

// Create axios instance - SIMPLE & RELIABLE
const apiClient = axios.create({
  // Configure baseURL - can be overridden
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5013/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ar',
  },
  timeout: 60000,
  withCredentials: true, // Important for cookies
});

// ============================================================
// REQUEST INTERCEPTOR - Add token on every request
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API] Request to: ${config.url} | Token sent: ${token.substring(0, 20)}...`);
    } else {
      console.log(`[API] Request to: ${config.url} | NO TOKEN`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// DEMO MOCK DATA - For offline/demo mode
// ============================================================

// Mock License Categories (A, B, C, D, E, F)
const DEMO_LICENSE_CATEGORIES = {
  success: true,
  message: 'تم جلب فئات الرخصة بنجاح',
  statusCode: 200,
  data: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      code: 'A',
      nameAr: 'رخصة درجة أولى - دراجة نارية',
      nameEn: 'Motorcycle License',
      minAge: 16,
      description: 'رخصة قيادة دراجات نارية بمختلف الأحجام'
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      code: 'B',
      nameAr: 'رخصة درجة ثانية - سيارة خصوصية',
      nameEn: 'Private Car License',
      minAge: 18,
      description: 'رخصة قيادة سيارة خاصة (حد أقصى ٣.٥ طن)'
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      code: 'C',
      nameAr: 'رخصة درجة ثالثة - مركبة صغيرة',
      nameEn: 'Small Vehicle License',
      minAge: 21,
      description: 'رخصة قيادة مركبة صغيرة (من ٣.٥ إلى ٧ طن)'
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      code: 'D',
      nameAr: 'رخصة درجة رابعة - مركبة كبيرة',
      nameEn: 'Large Vehicle License',
      minAge: 21,
      description: 'رخصة قيادة مركبة كبيرة (أكثر من ٧ طن)'
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      code: 'E',
      nameAr: 'رخصة درجة خامسة - مركبة مقطورة',
      nameEn: 'Trailer License',
      minAge: 21,
      description: 'رخصة قيادة مركبة مع مقطورة'
    },
    {
      id: '66666666-6666-6666-6666-666666666666',
      code: 'F',
      nameAr: 'رخصة درجة سادسة - مركبة خاصة',
      nameEn: 'Special Vehicle License',
      minAge: 18,
      description: 'رخصة قيادة مركبات خاصة معينة'
    }
  ]
};

// Mock Exam Centers
const DEMO_EXAM_CENTERS = {
  success: true,
  message: 'تم جلب مراكز الفحص بنجاح',
  statusCode: 200,
  data: [
    { code: '1', nameAr: 'مركز فحص القيادة المركزي', nameEn: 'Central Driving Test Center', regionCode: 'SA', regionNameAr: 'العاصمة' },
    { code: '2', nameAr: 'مركز فحص القيادة - عدن', nameEn: 'Driving Test Center - Aden', regionCode: 'AD', regionNameAr: 'عدن' },
    { code: '3', nameAr: 'مركز فحص القيادة - تعز', nameEn: 'Driving Test Center - Taiz', regionCode: 'TZ', regionNameAr: 'تعز' },
    { code: '4', nameAr: 'مركز فحص القيادة - الحديدة', nameEn: 'Driving Test Center - Hodeidah', regionCode: 'HD', regionNameAr: 'الحديدة' },
    { code: '5', nameAr: 'مركز فحص القيادة - إب', nameEn: 'Driving Test Center - Ibb', regionCode: 'IB', regionNameAr: 'إب' },
    { code: '6', nameAr: 'مركز فحص القيادة - صعدة', nameEn: 'Driving Test Center - Saadah', regionCode: 'SD', regionNameAr: 'صعدة' },
    { code: '7', nameAr: 'مركز فحص القيادة - المكلا', nameEn: 'Driving Test Center - Mukalla', regionCode: 'HM', regionNameAr: 'المكلا' }
  ]
};

// Mock Nationalities
const DEMO_NATIONALITIES = {
  success: true,
  message: 'تم جلب الجنسيات بنجاح',
  statusCode: 200,
  data: [
    { code: 'YE', nameAr: 'يمني', nameEn: 'Yemeni' },
    { code: 'SA', nameAr: 'سعودي', nameEn: 'Saudi' },
    { code: 'EG', nameAr: 'مصري', nameEn: 'Egyptian' },
    { code: 'SD', nameAr: 'سوداني', nameEn: 'Sudanese' },
    { code: 'IQ', nameAr: 'عراقي', nameEn: 'Iraqi' },
    { code: 'JO', nameAr: 'أردني', nameEn: 'Jordanian' },
    { code: 'SY', nameAr: 'سوري', nameEn: 'Syrian' },
    { code: 'LB', nameAr: 'لبناني', nameEn: 'Lebanese' },
    { code: 'LY', nameAr: 'ليبي', nameEn: 'Libyan' },
    { code: 'MA', nameAr: 'مغربي', nameEn: 'Moroccan' },
    { code: 'DZ', nameAr: 'جزائري', nameEn: 'Algerian' },
    { code: 'TN', nameAr: 'تونسي', nameEn: 'Tunisian' },
    { code: 'KW', nameAr: 'كويتي', nameEn: 'Kuwaiti' },
    { code: 'AE', nameAr: 'إماراتي', nameEn: 'Emirati' },
    { code: 'QA', nameAr: 'قطري', nameEn: 'Qatari' },
    { code: 'BH', nameAr: 'بحريني', nameEn: 'Bahraini' },
    { code: 'OM', nameAr: 'عماني', nameEn: 'Omani' },
    { code: 'PS', nameAr: 'فلسطيني', nameEn: 'Palestinian' },
    { code: 'US', nameAr: 'أمريكي', nameEn: 'American' },
    { code: 'GB', nameAr: 'بريطاني', nameEn: 'British' },
    { code: 'FR', nameAr: 'فرنسي', nameEn: 'French' },
    { code: 'DE', nameAr: 'ألماني', nameEn: 'German' },
    { code: 'TR', nameAr: 'تركي', nameEn: 'Turkish' },
    { code: 'IN', nameAr: 'هندي', nameEn: 'Indian' },
    { code: 'PK', nameAr: 'باكستاني', nameEn: 'Pakistani' },
    { code: 'CN', nameAr: 'صيني', nameEn: 'Chinese' }
  ]
};

// Mock Regions (Governorates)
const DEMO_REGIONS = {
  success: true,
  message: 'تم جلب المحافظات بنجاح',
  statusCode: 200,
  data: [
    { code: 'SA', nameAr: 'صنعاء', nameEn: 'Sanaa' },
    { code: 'AD', nameAr: 'عدن', nameEn: 'Aden' },
    { code: 'TZ', nameAr: 'تعز', nameEn: 'Taiz' },
    { code: 'HD', nameAr: 'الحديدة', nameEn: 'Hodeidah' },
    { code: 'IB', nameAr: 'إب', nameEn: 'Ibb' },
    { code: 'SD', nameAr: 'صعدة', nameEn: 'Saadah' },
    { code: 'HM', nameAr: 'المكلا', nameEn: 'Mukalla' },
    { code: 'BJ', nameAr: 'حجة', nameEn: 'Hajjah' },
    { code: 'LH', nameAr: 'الحديدة', nameEn: 'Lahj' },
    { code: 'MR', nameAr: 'مارب', nameEn: 'Marib' },
    { code: 'AJ', nameAr: 'الجوف', nameEn: 'Al Jawf' },
    { code: 'SH', nameAr: 'شبوة', nameEn: 'Shabwah' },
    { code: 'BA', nameAr: 'البيضاء', nameEn: 'Al Bayda' },
    { code: 'MW', nameAr: 'المحويت', nameEn: 'Al Mahwit' },
    { code: 'RM', nameAr: 'ريمه', nameEn: 'Raymah' },
    { code: 'AB', nameAr: 'أبين', nameEn: 'Abyan' },
    { code: 'DA', nameAr: 'الضالع', nameEn: 'Dhamar' },
    { code: 'DH', nameAr: 'الظهران', nameEn: 'Dhale' },
    { code: 'SN', nameAr: 'سقطرى', nameEn: 'Socotra' }
  ]
};

// Mock User Profile
const DEMO_USER_PROFILE = {
  success: true,
  message: 'تم جلب بيانات المستخدم بنجاح',
  statusCode: 200,
  data: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    fullName: 'محمد أحمد محمد',
    email: 'demo@mojaz.gov.ye',
    phoneNumber: '+967771234567',
    nationalId: '١٢٣٤٥٦٧٨',
    appRole: 0, // Applicant
    isActive: true,
    requiresPasswordReset: false,
    createdAt: '2025-01-15T08:00:00Z',
    address: 'شارع الزبيري، صنعاء',
    city: 'صنعاء',
    region: 'SA',
    dateOfBirth: '1990-05-20T00:00:00Z',
    gender: 0, // Male
    nationality: 'YE',
    bloodType: 2, // B+
    isEmailVerified: true,
    isPhoneVerified: true,
    isLocked: false,
    isSecurityBlocked: false
  }
};

// Mock Fee Structures
const DEMO_FEES = {
  success: true,
  message: 'تم جلب الرسوم بنجاح',
  statusCode: 200,
  data: [
    {
      id: 'f1111111-1111-1111-1111-111111111111',
      feeType: 0, // ApplicationFee
      feeTypeName: 'رسم تقديم الطلب',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 1000,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f2222222-2222-2222-2222-222222222222',
      feeType: 1, // MedicalExamFee
      feeTypeName: 'رسم الفحص الطبي',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 1500,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f3333333-3333-3333-3333-333333333333',
      feeType: 2, // TheoryTestFee
      feeTypeName: 'رسم اختبار النظرية',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 500,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f4444444-4444-4444-4444-444444444444',
      feeType: 3, // PracticalTestFee
      feeTypeName: 'رسم اختبار القيادة',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 2000,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f5555555-5555-5555-5555-555555555555',
      feeType: 4, // IssuanceFee
      feeTypeName: 'رسم إصدار الرخصة',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 3000,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f6666666-6666-6666-6666-666666666666',
      feeType: 5, // RetakeFee
      feeTypeName: 'رسم إعادة الاختبار',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 1000,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f7777777-7777-7777-7777-777777777777',
      feeType: 6, // RenewalFee
      feeTypeName: 'رسم تجديد الرخصة',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 2000,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f8888888-8888-8888-8888-888888888888',
      feeType: 7, // ReplacementFee
      feeTypeName: 'رسم استبدال الرخصة',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 1500,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    },
    {
      id: 'f9999999-9999-9999-9999-999999999999',
      feeType: 8, // CategoryUpgrade
      feeTypeName: 'رسم ترقية الفئة',
      licenseCategoryId: null,
      licenseCategoryName: null,
      amount: 2500,
      currency: 'SAR',
      effectiveFrom: '2025-01-01T00:00:00Z',
      effectiveTo: null,
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: null
    }
  ]
};

// Mock System Settings
const DEMO_SETTINGS = {
  success: true,
  message: 'تم جلب الإعدادات بنجاح',
  statusCode: 200,
  data: [
    { key: 'MIN_AGE_CATEGORY_A', value: '16', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة A' },
    { key: 'MIN_AGE_CATEGORY_B', value: '18', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة B' },
    { key: 'MIN_AGE_CATEGORY_C', value: '21', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة C' },
    { key: 'MIN_AGE_CATEGORY_D', value: '21', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة D' },
    { key: 'MIN_AGE_CATEGORY_E', value: '21', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة E' },
    { key: 'MIN_AGE_CATEGORY_F', value: '18', category: 'AGE_REQUIREMENTS', dataType: 'number', description: 'الحد الأدنى للعمر لفئة F' },
    { key: 'MAX_THEORY_ATTEMPTS', value: '3', category: 'EXAM_SETTINGS', dataType: 'number', description: 'الحد الأقصى لمحاولات اختبار النظرية' },
    { key: 'MAX_PRACTICAL_ATTEMPTS', value: '3', category: 'EXAM_SETTINGS', dataType: 'number', description: 'الحد الأقصى لمحاولات اختبار القيادة' },
    { key: 'COOLING_PERIOD_DAYS', value: '7', category: 'EXAM_SETTINGS', dataType: 'number', description: 'فترة الانتظار بين المحاولات' },
    { key: 'MEDICAL_VALIDITY_DAYS', value: '90', category: 'VALIDITY', dataType: 'number', description: 'صلاحية الفحص الطبي (يوم)' },
    { key: 'APPLICATION_VALIDITY_MONTHS', value: '6', category: 'VALIDITY', dataType: 'number', description: 'صلاحية الطلب (شهر)' },
    { key: 'OTP_VALIDITY_MINUTES_SMS', value: '5', category: 'OTP', dataType: 'number', description: 'صلاحية OTP عبر الرسائل' },
    { key: 'OTP_VALIDITY_MINUTES_EMAIL', value: '15', category: 'OTP', dataType: 'number', description: 'صلاحية OTP عبر البريد' },
    { key: 'OTP_MAX_ATTEMPTS', value: '3', category: 'OTP', dataType: 'number', description: 'الحد الأقصى لمحاولات OTP' },
    { key: 'OTP_RESEND_COOLDOWN_SECONDS', value: '60', category: 'OTP', dataType: 'number', description: 'الحد الأدنى بين إعادة إرسال OTP' },
    { key: 'PASSWORD_MIN_LENGTH', value: '8', category: 'SECURITY', dataType: 'number', description: 'الحد الأدنى لطول كلمة المرور' },
    { key: 'ACCOUNT_LOCKOUT_ATTEMPTS', value: '5', category: 'SECURITY', dataType: 'number', description: 'عدد المحاولات قبل القفل' },
    { key: 'ACCOUNT_LOCKOUT_MINUTES', value: '15', category: 'SECURITY', dataType: 'number', description: 'مدة قفل الحساب (دقيقة)' },
    { key: 'JWT_ACCESS_TOKEN_MINUTES', value: '60', category: 'SECURITY', dataType: 'number', description: 'صلاحية رمز الوصول JWT' },
    { key: 'JWT_REFRESH_TOKEN_DAYS', value: '7', category: 'SECURITY', dataType: 'number', description: 'صلاحية رمز التحديث JWT' },
    { key: 'MAX_FILE_SIZE_MB', value: '5', category: 'UPLOAD', dataType: 'number', description: 'الحد الأقصى لحجم الملف' },
    { key: 'SYSTEM_NAME_AR', value: 'منصة مُجاز', category: 'SYSTEM', dataType: 'string', description: 'اسم النظام بالعربية' },
    { key: 'SYSTEM_NAME_EN', value: 'Mojaz Platform', category: 'SYSTEM', dataType: 'string', description: 'System name in English' },
    { key: 'CONTACT_EMAIL', value: 'info@mojaz.gov.ye', category: 'SYSTEM', dataType: 'string', description: 'البريد الإلكتروني للتواصل' },
    { key: 'CONTACT_PHONE', value: '+9671234567', category: 'SYSTEM', dataType: 'string', description: 'رقم الهاتف للتواصل' }
  ]
};

// ============================================================
// RESPONSE INTERCEPTOR - Handle 401 with Demo Fallbacks
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response from: ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    
    // ============================================================
    // DEMO FALLBACK MODE - Return mock data for offline/demo
    // ============================================================
    
    // 1. License Categories
    if (url.includes('license-categories')) {
      console.log('[API Demo] Returning mock license categories for:', url);
      return Promise.resolve({ data: DEMO_LICENSE_CATEGORIES });
    }
    
    // 2. Lookup Data - Exam Centers
    if (url.includes('exam-centers')) {
      console.log('[API Demo] Returning mock exam centers for:', url);
      return Promise.resolve({ data: DEMO_EXAM_CENTERS });
    }
    
    // 3. Lookup Data - Nationalities
    if (url.includes('nationalities')) {
      console.log('[API Demo] Returning mock nationalities for:', url);
      return Promise.resolve({ data: DEMO_NATIONALITIES });
    }
    
    // 4. Lookup Data - Regions
    if (url.includes('regions') || url.includes('provinces')) {
      console.log('[API Demo] Returning mock regions for:', url);
      return Promise.resolve({ data: DEMO_REGIONS });
    }
    
    // 5. User Profile
    if (url.includes('users/me')) {
      console.log('[API Demo] Returning mock user profile for:', url);
      return Promise.resolve({ data: DEMO_USER_PROFILE });
    }
    
    // 6. Fees
    if (url.includes('fees')) {
      console.log('[API Demo] Returning mock fees for:', url);
      return Promise.resolve({ data: DEMO_FEES });
    }
    
    // 7. Settings
    if (url.includes('settings')) {
      console.log('[API Demo] Returning mock settings for:', url);
      return Promise.resolve({ data: DEMO_SETTINGS });
    }
    
    // ============================================================
    // EXISTING DEMO FALLBACKS - For payment, appointments, etc.
    // ============================================================
    
    if (url.includes('/pay') || url.includes('check-eligibility') || 
        url.includes('appointment') || url.includes('my-appointments') || 
        url.includes('queue') || url.includes('documents')) {
      console.log('[API Demo] Returning mock success for:', url);
      return Promise.resolve({
        data: { success: true, data: [], message: 'Demo mode', statusCode: 200 }
      });
    }
    
    // ============================================================
    // REAL ERROR HANDLING - For non-demo endpoints
    // ============================================================
    
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Log for debugging - use warn for client errors (4xx), error for server errors (5xx)
    const logMethod = status && status >= 400 && status < 500 ? 'warn' : 'error';
    const errorMessage = data?.message || data?.Message || error.message;
    
    console[logMethod](`[API] ${status} - ${errorMessage}`, {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: data
    });
    
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      // Only redirect if not on login page
      if (!window.location.pathname.includes('/login')) {
        const lang = document.documentElement.lang || 'ar';
        window.location.href = `/${lang}/login`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Enhanced error handler for API requests
 * Extracts the most relevant message from the response
 */
export const handleApiError = (error: any): { message: string; statusCode: number; errors?: string[] } => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (response) {
      const data = response.data;
      
      // Mojaz standardized ApiResponse format (handles both camelCase and PascalCase)
      const apiMessage = data?.message || data?.Message;
      const apiErrors = data?.errors || data?.Errors;
      const apiStatusCode = data?.statusCode || data?.StatusCode || response.status;

      return {
        message: apiMessage || `خطأ (${response.status}): ${response.statusText || 'فشل الطلب'}`,
        statusCode: apiStatusCode,
        errors: Array.isArray(apiErrors) ? apiErrors : undefined
      };
    }
    
    if (error.request) {
      return {
        message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
        statusCode: 0
      };
    }
  }
  
  return {
    message: (error as any)?.message || 'حدث خطأ غير متوقع',
    statusCode: 500
  };
};

// ============================================================
// EXPORT DEMO DATA - For use in components
// ============================================================
export const DEMO_DATA = {
  LICENSE_CATEGORIES: DEMO_LICENSE_CATEGORIES.data,
  EXAM_CENTERS: DEMO_EXAM_CENTERS.data,
  NATIONALITIES: DEMO_NATIONALITIES.data,
  REGIONS: DEMO_REGIONS.data,
  USER_PROFILE: DEMO_USER_PROFILE.data,
  FEES: DEMO_FEES.data,
  SETTINGS: DEMO_SETTINGS.data,
};