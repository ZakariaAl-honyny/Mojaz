namespace Mojaz.Shared.Constants;

/// <summary>
/// Application workflow stage constants.
/// Use Stage* (EN) constants for database storage and English display.
/// Use Stage*Ar constants for Arabic display.
/// </summary>
public static class ApplicationStages
{
    // Stage 01: Application Creation / تقديم الطلب
    public const string Stage01Creation = "01: Creation";
    public const string Stage01CreationAr = "01: تقديم الطلب";

    // Stage 02: Documents / المستندات
    public const string Stage02Documents = "02: Documents";
    public const string Stage02DocumentsAr = "02: المستندات";

    // Stage 03: Initial Payment / سداد الرسوم الأولية
    public const string Stage03InitialPayment = "03: Initial Payment";
    public const string Stage03InitialPaymentAr = "03: سداد الرسوم الأولية";

    // Stage 04: Medical / الفحص الطبي
    public const string Stage04Medical = "04: Medical";
    public const string Stage04MedicalAr = "04: الفحص الطبي";

    // Stage 05: Training / التدريب
    public const string Stage05Training = "05: Training";
    public const string Stage05TrainingAr = "05: التدريب";

    // Stage 06: Theory / الاختبار النظري
    public const string Stage06Theory = "06: Theory";
    public const string Stage06TheoryAr = "06: الاختبار النظري";

    // Stage 07: Practical / الاختبار العملي
    public const string Stage07Practical = "07: Practical";
    public const string Stage07PracticalAr = "07: الاختبار العملي";

    // Stage 08: Final Approval / الاعتماد النهائي
    public const string Stage08FinalApproval = "08: Final Approval";
    public const string Stage08FinalApprovalAr = "08: الاعتماد النهائي";

    // Stage 09: Issuance Payment / سداد رسوم الإصدار
    public const string Stage09IssuancePayment = "09: Issuance Payment";
    public const string Stage09IssuancePaymentAr = "09: سداد رسوم الإصدار";

    // Stage 10: Issuance / إصدار الرخصة
    public const string Stage10Issuance = "10: Issuance";
    public const string Stage10IssuanceAr = "10: إصدار الرخصة";

    // Legacy constants (for backward compatibility with existing database values)
    public const string Creation = Stage01Creation;
    public const string Documents = Stage02Documents;
    public const string InitialPayment = Stage03InitialPayment;
    public const string Medical = Stage04Medical;
    public const string Training = Stage05Training;
    public const string Theory = Stage06Theory;
    public const string Practical = Stage07Practical;
    public const string FinalApproval = Stage08FinalApproval;
    public const string IssuancePayment = Stage09IssuancePayment;
    public const string Issuance = Stage10Issuance;
}
