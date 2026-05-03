import { ApplicationWithDetailsDto } from "@/services/application.service";
import { ApplicationStageLabels } from "@/lib/enumMappers";
import { ServiceTypeLabels, LicenseCategoryLabels } from "@/types/wizard.types";

export const exportApplicationToHtml = (app: ApplicationWithDetailsDto) => {
  const getServiceLabel = (type: any) => (ServiceTypeLabels as any)[type]?.ar || type;
  const getCategoryLabel = (code: any) => (LicenseCategoryLabels as any)[code]?.ar || code;
  const getStageLabel = (stage: any) => (ApplicationStageLabels as any)[stage] || stage;

  const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>معاملة رقم ${app.applicationNumber} - منصة مُجاز</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #1a3a8f;
            --secondary: #D4A017;
            --text-dark: #1f2937;
            --text-light: #6b7280;
            --bg-light: #f9fafb;
            --emerald: #10b981;
        }

        body {
            font-family: 'IBM Plex Sans Arabic', 'Cairo', sans-serif;
            background-color: #f3f4f6;
            color: var(--text-dark);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .page {
            box-sizing: border-box;
            width: 100%;
            max-width: 900px;
            min-height: 297mm;
            padding: 50px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            position: relative;
            border-radius: 8px;
        }

        @media print {
            body { background: none; }
            .page { 
                width: 210mm; 
                margin: 0 auto; 
                box-shadow: none; 
                padding: 15mm;
                border-radius: 0;
            }
            .no-print { display: none; }
            @page { size: A4; margin: 0; }
        }

        header {
            border-bottom: 3px solid var(--primary);
            padding-bottom: 25px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-area {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo-symbol {
            width: 50px;
            height: 50px;
            background: var(--primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: 24px;
        }

        .logo-text h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 900;
            color: var(--primary);
            letter-spacing: -1px;
        }

        .logo-text p {
            margin: 0;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-light);
        }

        .qr-code {
            width: 80px;
            height: 80px;
            border: 1px solid #eee;
            padding: 5px;
            border-radius: 8px;
        }

        .doc-title {
            text-align: center;
            margin-bottom: 40px;
        }

        .doc-title h2 {
            font-size: 32px;
            font-weight: 900;
            margin: 0;
            color: var(--text-dark);
        }

        .doc-title p {
            color: var(--text-light);
            font-weight: 600;
            margin-top: 5px;
        }

        .section {
            margin-bottom: 35px;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
        }

        .section-icon {
            width: 32px;
            height: 32px;
            background: #f0f4ff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
        }

        .section-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 900;
        }

        .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .data-item {
            padding: 15px;
            background: var(--bg-light);
            border-radius: 12px;
            border: 1px solid #f1f5f9;
        }

        .data-label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            color: var(--text-light);
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }

        .data-value {
            display: block;
            font-size: 16px;
            font-weight: 900;
            color: var(--text-dark);
        }

        .status-pill {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 900;
            background: #ecfdf5;
            color: #059669;
        }

        .document-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .document-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
        }

        .doc-icon {
            font-size: 24px;
        }

        footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--text-light);
            font-size: 12px;
            font-weight: 600;
        }

        .stamp {
            border: 3px double #ddd;
            padding: 15px;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 10px;
            font-weight: 900;
            color: #ddd;
            transform: rotate(-15deg);
            margin-top: -50px;
        }

        .download-btn {
            position: fixed;
            bottom: 40px;
            left: 40px;
            background: var(--primary);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 900;
            box-shadow: 0 10px 20px rgba(26, 58, 143, 0.3);
            z-index: 100;
            transition: all 0.3s;
        }

        .download-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(26, 58, 143, 0.4);
        }
    </style>
</head>
<body>
    <a href="javascript:window.print()" class="download-btn no-print">طباعة المعاملة</a>

    <div class="page">
        <header>
            <div class="logo-area">
                <div class="logo-symbol">M</div>
                <div class="logo-text">
                    <h1>مُجاز</h1>
                    <p>المنصة الوطنية الموحدة لتراخيص القيادة</p>
                </div>
            </div>
            <div class="header-info">
                <p style="margin:0; font-weight:900; color:var(--primary)">الجمهورية اليمنية</p>
                <p style="margin:0; font-size:12px; color:var(--text-light)">وزارة الداخلية - مصلحة المرور</p>
            </div>
        </header>

        <div class="doc-title">
            <h2>ملف المعاملة السيادية</h2>
            <p>سجل تفصيلي لحالة الطلب والوثائق المرفقة</p>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-icon">📑</div>
                <h3>بيانات المعاملة الأساسية</h3>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">رقم المعاملة</span>
                    <span class="data-value">${app.applicationNumber}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">حالة الطلب</span>
                    <span class="data-value">
                        <span class="status-pill">${app.status}</span>
                    </span>
                </div>
                <div class="data-item">
                    <span class="data-label">نوع الخدمة</span>
                    <span class="data-value">${getServiceLabel(app.serviceType)}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">فئة الرخصة</span>
                    <span class="data-value">فئة ${getCategoryLabel(app.licenseCategoryCode)}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">المرحلة الحالية</span>
                    <span class="data-value">${getStageLabel(app.currentStage)}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">تاريخ التقديم</span>
                    <span class="data-value">${new Date(app.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-icon">👤</div>
                <h3>بيانات صاحب المعاملة</h3>
            </div>
            <div class="data-grid">
                <div class="data-item">
                    <span class="data-label">الاسم الكامل</span>
                    <span class="data-value">${app.applicantName || app.fullName || '---'}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">الرقم الوطني</span>
                    <span class="data-value">${app.nationalId || '---'}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">رقم الجوال</span>
                    <span class="data-value" dir="ltr">${app.mobileNumber || '---'}</span>
                </div>
                <div class="data-item">
                    <span class="data-label">الموقع الجغرافي</span>
                    <span class="data-value">${app.city || 'صنعاء'} - ${app.region || 'أمانة العاصمة'}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <div class="section-icon">📁</div>
                <h3>المستندات المرفقة (${app.documents?.length || 0})</h3>
            </div>
            <div class="document-list">
                ${app.documents?.map(doc => `
                    <div class="document-item">
                        <span class="doc-icon">📄</span>
                        <div>
                            <p style="margin:0; font-weight:900; font-size:14px;">${doc.documentTypeName}</p>
                            <p style="margin:0; font-size:10px; color:var(--text-light);">${doc.originalFileName}</p>
                        </div>
                    </div>
                `).join('') || '<p>لا توجد مستندات مرفوعة</p>'}
            </div>
        </div>

        <div style="display:flex; justify-content: flex-end; margin-top: 40px;">
            <div class="stamp">
                ختم المنصة الرقمي<br>VERIFIED
            </div>
        </div>

        <footer>
            <div>تم استخراج هذا الملف آلياً من منصة مُجاز بتاريخ ${new Date().toLocaleDateString('ar-SA')}</div>
            <div style="letter-spacing: 1px;">MOJAZ-SYSTEM-CENTRAL</div>
        </footer>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Application_${app.applicationNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
