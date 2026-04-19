const puppeteer = require('puppeteer');

/**
 * Generate PDF from form data using Puppeteer
 * Ensures proper Arabic RTL rendering and professional formatting
 * @param {Object} data - Form data object
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generatePDFFromData(data) {
    let browser;
    try {
        // Launch browser with headless mode
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Create HTML template with proper Arabic RTL support
        const htmlContent = createHTMLTemplate(data);

        // Set HTML content with network idle wait
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Wait a bit for fonts to load
        await page.waitForTimeout(500);

        // Generate PDF with professional settings
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '15mm',
                right: '15mm',
                bottom: '15mm',
                left: '15mm'
            }
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        if (browser) {
            try {
                await browser.close();
            } catch (closeErr) {
                console.error('Error closing browser:', closeErr);
            }
        }
        throw new Error(`PDF Generation Failed: ${error.message}`);
    }
}

/**
 * Create HTML template with full Arabic RTL support
 * @param {Object} data - Form data
 * @returns {string} HTML string
 */
function createHTMLTemplate(data) {
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نموذج استقبال مريض الحجامة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            direction: rtl;
            text-align: right;
        }

        body {
            font-family: 'Cairo', 'Arial', sans-serif;
            font-size: 13px;
            line-height: 1.8;
            color: #333;
            background: #fff;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
        }

        .header h1 {
            font-size: 24px;
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 12px;
            color: #666;
        }

        .section {
            margin-bottom: 20px;
            background: #f8f9fa;
            padding: 12px;
            border-right: 4px solid #2c3e50;
            page-break-inside: avoid;
        }

        .section h2 {
            font-size: 16px;
            color: #2c3e50;
            font-weight: 700;
            margin-bottom: 12px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        }

        .section-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .field {
            word-wrap: break-word;
        }

        .field-label {
            font-weight: 700;
            color: #2c3e50;
            font-size: 12px;
            margin-bottom: 3px;
        }

        .field-value {
            color: #555;
            font-size: 13px;
            padding: 6px;
            background: white;
            border-radius: 3px;
        }

        .field-full {
            grid-column: 1 / -1;
        }

        .list-item {
            margin: 6px 0;
            padding-right: 12px;
            color: #555;
        }

        .list-item:before {
            content: "• ";
            color: #2c3e50;
            font-weight: bold;
            margin-left: 8px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .container {
                padding: 15px;
            }
            .section {
                page-break-inside: avoid;
            }
        }

        .signature-section {
            margin-top: 25px;
            border-top: 2px solid #2c3e50;
            padding-top: 15px;
        }

        .signature-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 10px;
        }

        .signature-box {
            text-align: center;
            padding: 10px;
            border: 1px solid #ddd;
        }

        .empty-value {
            color: #999;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>نموذج استقبال مريض الحجامة</h1>
            <p>Medical Intake Form</p>
        </div>

        <!-- Basic Information -->
        <div class="section">
            <h2>البيانات الأساسية</h2>
            <div class="section-content">
                <div class="field">
                    <div class="field-label">الاسم الكامل</div>
                    <div class="field-value">${escapeHtml(data.patientName) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">العمر</div>
                    <div class="field-value">${escapeHtml(data.patientAge) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">الجنس</div>
                    <div class="field-value">${escapeHtml(data.patientGender) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">رقم الهاتف</div>
                    <div class="field-value">${escapeHtml(data.patientPhone) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field field-full">
                    <div class="field-label">العنوان</div>
                    <div class="field-value">${escapeHtml(data.patientAddress) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Medical History -->
        <div class="section">
            <h2>التاريخ الطبي</h2>
            <div class="section-content">
                <div class="field field-full">
                    <div class="field-label">الأمراض المزمنة</div>
                    <div class="field-value">
                        ${data.medicalHistory && data.medicalHistory.length > 0
                            ? data.medicalHistory.map(item => `<div class="list-item">${escapeHtml(item)}</div>`).join('')
                            : '<span class="empty-value">لا توجد أمراض مدرجة</span>'
                        }
                    </div>
                </div>
                <div class="field field-full">
                    <div class="field-label">أمراض أخرى</div>
                    <div class="field-value">${escapeHtml(data.otherDiseases) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
                <div class="field field-full">
                    <div class="field-label">مشاكل صحية أخرى</div>
                    <div class="field-value">${escapeHtml(data.otherProblems) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Medications -->
        <div class="section">
            <h2>الأدوية والمكملات</h2>
            <div class="section-content">
                <div class="field">
                    <div class="field-label">هل يتناول أدوية؟</div>
                    <div class="field-value">${escapeHtml(data.takingMeds) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">مميعات الدم</div>
                    <div class="field-value">${escapeHtml(data.bloodThinners) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field field-full">
                    <div class="field-label">أسماء الأدوية</div>
                    <div class="field-value">${escapeHtml(data.medsList) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Contraindications -->
        <div class="section">
            <h2>موانع الحجامة</h2>
            <div class="section-content">
                <div class="field field-full">
                    <div class="field-label">الموانع المسجلة</div>
                    <div class="field-value">
                        ${data.contraindications && data.contraindications.length > 0
                            ? data.contraindications.map(item => `<div class="list-item">${escapeHtml(item)}</div>`).join('')
                            : '<span class="empty-value">لا توجد موانع مسجلة</span>'
                        }
                    </div>
                </div>
                <div class="field field-full">
                    <div class="field-label">موانع أخرى</div>
                    <div class="field-value">${escapeHtml(data.otherContraindications) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Medical Tests -->
        <div class="section">
            <h2>الفحوصات الطبية</h2>
            <div class="section-content">
                <div class="field">
                    <div class="field-label">فحوصات دم حديثة</div>
                    <div class="field-value">${escapeHtml(data.recentBloodTest) || '<span class="empty-value">غير محدد</span>'}</div>
                </div>
                <div class="field field-full">
                    <div class="field-label">تفاصيل الفحوصات</div>
                    <div class="field-value">${escapeHtml(data.bloodTestIssues) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Reason for Cupping -->
        <div class="section">
            <h2>سبب طلب الحجامة</h2>
            <div class="section-content">
                <div class="field field-full">
                    <div class="field-label">الألم / المكان</div>
                    <div class="field-value">${escapeHtml(data.painLocation) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
                <div class="field field-full">
                    <div class="field-label">هل سبق إجراء حجامة؟</div>
                    <div class="field-value">${escapeHtml(data.previousCupping) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Clinical Examination -->
        <div class="section">
            <h2>الفحص السريري</h2>
            <div class="section-content">
                <div class="field">
                    <div class="field-label">درجة الحرارة</div>
                    <div class="field-value">${escapeHtml(data.temperature) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">ضغط الدم والنبض</div>
                    <div class="field-value">${escapeHtml(data.bloodPressure) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">مستوى الألم</div>
                    <div class="field-value">${escapeHtml(data.painLevel) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
                <div class="field">
                    <div class="field-label">فحص يدوي</div>
                    <div class="field-value">${escapeHtml(data.physicalExamCheck) || '<span class="empty-value">لا يوجد</span>'}</div>
                </div>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="section signature-section">
            <h2>إقرار المريض</h2>
            <div class="signature-row">
                <div class="signature-box">
                    <p style="margin-bottom: 30px; min-height: 40px;">_______________</p>
                    <p style="font-weight: 700;">توقيع المريض</p>
                </div>
                <div class="signature-box">
                    <p style="margin-bottom: 8px;"><strong>اسم الموقّع:</strong> ${escapeHtml(data.signatureName) || '<span class="empty-value">غير محدد</span>'}</p>
                    <p><strong>التاريخ:</strong> ${escapeHtml(data.signatureDate) || '<span class="empty-value">غير محدد</span>'}</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>تم إنشاء هذا النموذج باستخدام نظام الحجامة الطبي</p>
            <p>Generated on ${new Date().toLocaleDateString('ar-SA')}</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, char => map[char]);
}

module.exports = { generatePDFFromData };
