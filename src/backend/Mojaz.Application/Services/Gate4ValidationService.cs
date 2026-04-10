using Mojaz.Application.Interfaces.Services;
using Mojaz.Domain.Entities;
using Mojaz.Domain.Enums;
using Mojaz.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mojaz.Application.Services;

public class Gate4ValidationService : IGate4ValidationService
{
    private readonly IRepository<Mojaz.Domain.Entities.Application> _applicationRepository;
    private readonly IRepository<Mojaz.Domain.Entities.User> _userRepository;
    private readonly IRepository<TheoryTest> _theoryTestRepository;
    private readonly IRepository<PracticalTest> _practicalTestRepository;
    private readonly IRepository<MedicalExamination> _medicalExamRepository;
    private readonly IRepository<PaymentTransaction> _paymentRepository;

    public Gate4ValidationService(
        IRepository<Mojaz.Domain.Entities.Application> applicationRepository,
        IRepository<Mojaz.Domain.Entities.User> userRepository,
        IRepository<TheoryTest> theoryTestRepository,
        IRepository<PracticalTest> practicalTestRepository,
        IRepository<MedicalExamination> medicalExamRepository,
        IRepository<PaymentTransaction> paymentRepository)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _theoryTestRepository = theoryTestRepository;
        _practicalTestRepository = practicalTestRepository;
        _medicalExamRepository = medicalExamRepository;
        _paymentRepository = paymentRepository;
    }

    public async Task<Gate4ValidationResult> ValidateAsync(Guid applicationId)
    {
        var conditions = new List<Gate4Condition>();
        
        // Load application
        var application = await _applicationRepository.GetByIdAsync(applicationId);
        if (application == null)
        {
            return new Gate4ValidationResult
            {
                IsFullyPassed = false,
                Conditions = new List<Gate4Condition>
                {
                    new() { Key = "ApplicationNotFound", LabelAr = "الطلب", LabelEn = "Application", IsPassed = false, FailureMessageAr = "الطلب غير موجود", FailureMessageEn = "Application not found" }
                }
            };
        }

        // Load applicant
        var applicant = await _userRepository.GetByIdAsync(application.ApplicantId);

        // Condition 1: Theory Test Passed
        var theoryTests = await _theoryTestRepository.FindAsync(t => t.ApplicationId == applicationId);
        var latestTheory = theoryTests?.OrderByDescending(t => t.CreatedAt).FirstOrDefault();
        var theoryPassed = latestTheory != null && latestTheory.Result == TestResult.Pass;
        conditions.Add(new Gate4Condition
        {
            Key = "TheoryTestPassed",
            LabelAr = "اختبار النظري",
            LabelEn = "Theory Test",
            IsPassed = theoryPassed,
            FailureMessageAr = theoryPassed ? null : "لم يتم اجتياز اختبار النظري.",
            FailureMessageEn = theoryPassed ? null : "Theory test has not been passed."
        });

        // Condition 2: Practical Test Passed
        var practicalTests = await _practicalTestRepository.FindAsync(p => p.ApplicationId == applicationId);
        var latestPractical = practicalTests?.OrderByDescending(p => p.CreatedAt).FirstOrDefault();
        var practicalPassed = latestPractical != null && latestPractical.Result == TestResult.Pass;
        conditions.Add(new Gate4Condition
        {
            Key = "PracticalTestPassed",
            LabelAr = "الاختبار العملي",
            LabelEn = "Practical Test",
            IsPassed = practicalPassed,
            FailureMessageAr = practicalPassed ? null : "لم يتم اجتياز الاختبار العملي.",
            FailureMessageEn = practicalPassed ? null : "Practical test has not been passed."
        });

        // Condition 3: Security Status Clean
        var securityClean = applicant != null && !applicant.IsSecurityBlocked;
        conditions.Add(new Gate4Condition
        {
            Key = "SecurityStatusClean",
            LabelAr = "الوضع الأمني",
            LabelEn = "Security Status",
            IsPassed = securityClean,
            FailureMessageAr = securityClean ? null : "يوجد حظر أمني على مقدم الطلب.",
            FailureMessageEn = securityClean ? null : "Applicant has an active security block."
        });

        // Condition 4: Identity Document Valid
        var identityValid = !string.IsNullOrEmpty(applicant?.NationalId);
        conditions.Add(new Gate4Condition
        {
            Key = "IdentityDocumentValid",
            LabelAr = "صلاحية وثيقة الهوية",
            LabelEn = "Identity Document Validity",
            IsPassed = identityValid,
            FailureMessageAr = identityValid ? null : "وثيقة الهوية منتهية الصلاحية أو مفقودة.",
            FailureMessageEn = identityValid ? null : "Identity document is expired or missing."
        });

        // Condition 5: Medical Certificate Valid
        var medicalExams = await _medicalExamRepository.FindAsync(m => m.ApplicationId == applicationId);
        var latestMedical = medicalExams?.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
        var medicalValid = latestMedical != null && 
                         latestMedical.FitnessResult == MedicalFitnessResult.Fit &&
                         (latestMedical.ValidUntil == null || latestMedical.ValidUntil > DateTime.UtcNow);
        conditions.Add(new Gate4Condition
        {
            Key = "MedicalCertificateValid",
            LabelAr = "صلاحية الشهادة الطبية",
            LabelEn = "Medical Certificate Validity",
            IsPassed = medicalValid,
            FailureMessageAr = medicalValid ? null : "الشهادة الطبية غير صالحة.",
            FailureMessageEn = medicalValid ? null : "Medical certificate is not valid."
        });

        // Condition 6: All Payments Cleared
        var payments = await _paymentRepository.FindAsync(p => p.ApplicationId == applicationId);
        var hasPendingOrFailedPayment = payments != null && payments.Any(p => p.Status == PaymentStatus.Pending || p.Status == PaymentStatus.Failed);
        var allPaymentsCleared = !hasPendingOrFailedPayment;
        conditions.Add(new Gate4Condition
        {
            Key = "AllPaymentsCleared",
            LabelAr = "سداد جميع الرسوم",
            LabelEn = "All Payments Cleared",
            IsPassed = allPaymentsCleared,
            FailureMessageAr = allPaymentsCleared ? null : "توجد رسوم معلقة أو فشلت في السداد.",
            FailureMessageEn = allPaymentsCleared ? null : "There are pending or failed payments."
        });

        var isFullyPassed = conditions.All(c => c.IsPassed);

        return new Gate4ValidationResult
        {
            IsFullyPassed = isFullyPassed,
            Conditions = conditions
        };
    }
}