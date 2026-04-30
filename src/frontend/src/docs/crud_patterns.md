# Mojaz CRUD & Routing Reliability Guide (Senior Dev Version)

لضمان عمل النظام بشكل مثالي أثناء العرض (Project Defense)، يجب تجنب التعقيدات غير الضرورية والاعتماد على أنماط "رصينة" (Bulletproof) تضمن تزامن البيانات بين قاعدة البيانات والواجهة.

---

## 1. حل مشكلة التوجيه بعد الدخول (Login Redirect Fix)

**المشكلة:** "حالة السباق" (Race Condition) تحدث لأن Next.js يحاول الانتقال للصفحة التالية قبل أن يكتمل كتابة الـ Cookie في المتصفح، مما يجعل الـ Middleware يعتقد أن المستخدم غير مسجل دخول فيعيده لصفحة الدخول.

**الحل:** استخدام `window.location.href` بدلاً من `router.push`. هذا يضمن إعادة تحميل الصفحة بالكامل مع إرسال جميع ملفات تعريف الارتباط (Cookies) الحديثة إلى السيرفر.

```typescript
// LoginForm.tsx (بداخل onSubmit)
const onSubmit = async (data: LoginValues) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data.data;

    // 1. تخزين البيانات في المتجر والملفات (Cookies)
    setAuth(user, accessToken, refreshToken);

    // 2. التوجيه بناءً على الدور (Role)
    // 0 = Applicant, 1-6 = Employees/Admin
    const path = user.role === 0 ? '/dashboard' : '/dashboard'; 
    
    // الحل الجذري: استخدام window.location لضمان مزامنة الكوكيز 100%
    window.location.href = path;
    
  } catch (err) {
    // معالجة الخطأ
  }
};
```

---

## 2. نمط العمليات (CRUD) الموثوق

أفضل طريقة لضمان تحديث الواجهة فوراً بعد (إضافة/تعديل/حذف) دون الحاجة لإدارة حالات (State) معقدة هي استخدام **Query Invalidation**.

### أ. نمط التعديل/الإضافة (Mutation Pattern)

عندما تضغط على "حفظ" أو "موافقة"، استخدم هذا النمط في الـ Hook الخاص بالعملية:

```typescript
import { useQueryClient, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export const useApproveApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // إرسال البيانات للسيرفر
      return await apiClient.patch(`/applications/${id}/approve`);
    },
    onSuccess: () => {
      // 1. أهم خطوة: إبطال الكاش فوراً لإجبار النظام على جلب البيانات الجديدة من قاعدة البيانات
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      // 2. إشعار المستخدم بالنجاح
      toast({
        title: "تمت العملية بنجاح",
        variant: "default",
      });
    }
  });
};
```

### ب. نمط العرض الصارم (Read Pattern)

تأكد دائماً من أن `useQuery` لها `staleTime` منخفض أو صفر لضمان تحديث البيانات:

```typescript
const { data, refetch } = useQuery({
  queryKey: ['applications'],
  queryFn: () => applicationService.getAll(),
  staleTime: 0, // لضمان عدم استخدام بيانات قديمة أبداً أثناء العرض
});
```

---

## 3. نصيحة للمناقشة (Pro-Tip)
إذا واجهت أي تأخير في تحديث البيانات أثناء العرض، يمكنك دائماً إضافة زر "تحديث يدوي" (Refresh) يقوم باستدعاء دالة `refetch()` الخاصة بـ React Query. هذا يعطي انطباعاً بأن النظام يتعامل مع بيانات حقيقية ولحظية.
