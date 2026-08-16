require('dotenv').config();

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const puppeteer = require('puppeteer');
const { Resend } = require('resend');

const app = express();

if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY in environment');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const mailFrom = process.env.RESEND_FROM || 'onboarding@resend.dev';
const mailTo = process.env.RESEND_TO || 'tclinic65@gmail.com';

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCairoFontFaceCss() {
    const basePath = path.join(
        __dirname,
        'node_modules',
        '@fontsource',
        'cairo',
        'files'
    );

    const regularPath = path.join(
        basePath,
        'cairo-arabic-400-normal.woff2'
    );

    const boldPath = path.join(
        basePath,
        'cairo-arabic-700-normal.woff2'
    );

    const regularBase64 = fs.readFileSync(regularPath).toString('base64');
    const boldBase64 = fs.readFileSync(boldPath).toString('base64');

    return `
        @font-face {
            font-family: 'CairoEmbedded';
            src: url(data:font/woff2;base64,${regularBase64}) format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }

        @font-face {
            font-family: 'CairoEmbedded';
            src: url(data:font/woff2;base64,${boldBase64}) format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }
    `;
}

function getLogoDataUrl() {
    try {
        const logoPath = path.join(__dirname, 'logo.png');
        const logoBase64 = fs.readFileSync(logoPath).toString('base64');

        return `data:image/png;base64,${logoBase64}`;
    } catch (error) {
        console.warn(
            'Logo not found or failed to read:',
            error && error.message
        );

        return '';
    }
}

function renderPdfHtml(formData) {
    const data = formData || {};

    const medicalHistory = Array.isArray(data.medicalHistory)
        ? data.medicalHistory
        : [];

    const contraindications = Array.isArray(data.contraindications)
        ? data.contraindications
        : [];

    const cairoFontCss = getCairoFontFaceCss();
    const logoDataUrl = getLogoDataUrl();

    const row = (label, value) => `
        <tr>
            <td class="label">${escapeHtml(label)}</td>
            <td class="value">${escapeHtml(value)}</td>
        </tr>
    `;

    const list = (items) => {
        if (!items.length) {
            return '<div class="muted">لا يوجد</div>';
        }

        return `
            <ul>
                ${items
                    .map((item) => `<li>${escapeHtml(item)}</li>`)
                    .join('')}
            </ul>
        `;
    };

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>نموذج استقبال مريض الحجامة</title>

    <style>
        ${cairoFontCss}

        @page {
            size: A4;
            margin: 14mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            direction: rtl;
            font-family: "CairoEmbedded", "Arial", sans-serif;
            color: #111827;
            line-height: 1.6;
            font-size: 13px;
        }

        h1 {
            margin: 0;
        }

        h2 {
            margin: 14px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 17px;
        }

        .brand-header {
            margin-bottom: 16px;
            text-align: center;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .logo {
            display: block;
            width: auto;
            height: auto;
            max-width: 180px;
            max-height: 76px;
            margin: 0 auto 6px;
            object-fit: contain;
        }

        .clinic-slogan {
            margin: 0 0 4px;
            color: #0f766e;
            font-size: 15px;
            font-weight: 700;
        }

        .clinic-title {
            max-width: 680px;
            margin: 0 auto;
            color: #111827;
            font-size: 21px;
            font-weight: 700;
            line-height: 1.45;
            overflow-wrap: anywhere;
        }

        .form-title {
            width: 100%;
            margin: 5px 0 0;
            padding-top: 9px;
            border-top: 2px solid #0f766e;
            color: #1f2937;
            font-size: 23px;
            font-weight: 700;
            line-height: 1.4;
        }

        .section {
            margin-bottom: 12px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 6px 8px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .label {
            width: 30%;
            color: #374151;
            font-weight: 700;
        }

        .value {
            width: 70%;
        }

        ul {
            margin: 6px 0;
            padding: 0 18px 0 0;
        }

        .muted {
            color: #6b7280;
        }

        .disclaimer {
            margin-top: 12px;
            padding: 8px;
            border: 1px solid #eef2ff;
            border-radius: 6px;
            background: #ffffff;
            color: #111827;
            font-size: 13px;
        }

        .signatures {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-areas: "therapist patient";
            direction: ltr;
            gap: 16px;
            margin-top: 16px;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .signature-card {
            direction: rtl;
            min-width: 0;
            padding: 13px 14px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: #ffffff;
        }

        .patient-signature {
            grid-area: patient;
        }

        .therapist-signature {
            grid-area: therapist;
        }

        .signature-card-title {
            margin: 0 0 12px;
            color: #0f766e;
            font-size: 15px;
            font-weight: 700;
        }

        .signature-field {
            display: flex;
            align-items: flex-end;
            gap: 7px;
            min-width: 0;
            margin-top: 13px;
            font-size: 13px;
            font-weight: 700;
        }

        .signature-field-label {
            flex: 0 0 auto;
        }

        .signature-line {
            flex: 1 1 auto;
            min-width: 90px;
            min-height: 25px;
            padding: 0 4px 3px;
            border-bottom: 1px solid #374151;
            font-weight: 400;
            overflow-wrap: anywhere;
        }
    </style>
</head>

<body>
    <header class="brand-header">
        ${
            logoDataUrl
                ? `<img
                    class="logo"
                    src="${logoDataUrl}"
                    alt="شعار المركز الطبي"
                >`
                : ''
        }

        <div class="clinic-slogan">
            #استثمر في صحتك
        </div>

        <div class="clinic-title">
            مركز طبي متخصص بمشاكل المفاصل والعضلات ومشاكل الأعصاب والحركة
        </div>

        <h1 class="form-title">
            نموذج استقبال مريض الحجامة
        </h1>
    </header>

    <div class="section">
        <h2>البيانات الأساسية</h2>

        <table>
            ${row('الاسم', data.patientName)}
            ${row('العمر', data.patientAge)}
            ${row('الجنس', data.patientGender)}
            ${row('رقم الهاتف', data.patientPhone)}
            ${row('العنوان', data.patientAddress)}
        </table>
    </div>

    <div class="section">
        <h2>التاريخ الطبي</h2>

        ${list(medicalHistory)}

        <table>
            ${row('أمراض أخرى', data.otherDiseases)}
            ${row('مشاكل صحية أخرى', data.otherProblems)}
        </table>
    </div>

    <div class="section">
        <h2>الأدوية</h2>

        <table>
            ${row('هل يتناول أدوية؟', data.takingMeds)}
            ${row('أسماء الأدوية', data.medsList)}
            ${row('مميعات الدم', data.bloodThinners)}
        </table>
    </div>

    <div class="section">
        <h2>موانع الحجامة</h2>

        ${list(contraindications)}

        <table>
            ${row('أخرى', data.otherContraindications)}
        </table>
    </div>

    <div class="section">
        <h2>الفحوصات الطبية</h2>

        <table>
            ${row(
                'فحوصات دم خلال الستة أشهر الماضية',
                data.recentBloodTest
            )}

            ${row(
                'تفاصيل الفحوصات',
                data.bloodTestIssues
            )}
        </table>
    </div>

    <div class="section">
        <h2>سبب طلب الحجامة</h2>

        <table>
            ${row('الألم / مكانه', data.painLocation)}
            ${row('السابق إجراء حجامة', data.previousCupping)}
        </table>
    </div>

    <div class="section">
        <h2>الفحص السريري</h2>

        <table>
            ${row('الحرارة', data.temperature)}
            ${row('ضغط الدم والنبض', data.bloodPressure)}
            ${row('مستوى الألم', data.painLevel)}
            ${row('فحص يدوي للمريض', data.physicalExamCheck)}
        </table>
    </div>

    <div class="section">
        <h2>إقرار المريض</h2>

        <table>
            ${row('اسم الموقّع', data.signatureName)}
            ${row('التاريخ', data.signatureDate)}
        </table>
    </div>

    <div class="disclaimer">
        أقر أنا الموقع أدناه أن جميع المعلومات المذكورة صحيحة،
        وأوافق على إجراء الحجامة بعد شرح الفوائد والمخاطر لي.
    </div>

    <section
        class="signatures"
        aria-label="التوقيعات"
    >
        <div class="signature-card patient-signature">
            <div class="signature-card-title">
                بيانات المريض
            </div>

            <div class="signature-field">
                <span class="signature-field-label">
                    اسم المريض:
                </span>

                <span class="signature-line">
                    ${escapeHtml(data.signatureName)}
                </span>
            </div>

            <div class="signature-field">
                <span class="signature-field-label">
                    توقيع المريض:
                </span>

                <span class="signature-line"></span>
            </div>
        </div>

        <div class="signature-card therapist-signature">
            <div class="signature-card-title">
                بيانات المعالج
            </div>

            <div class="signature-field">
                <span class="signature-field-label">
                    اسم المعالج:
                </span>

                <span class="signature-line"></span>
            </div>

            <div class="signature-field">
                <span class="signature-field-label">
                    توقيع المعالج:
                </span>

                <span class="signature-line"></span>
            </div>
        </div>
    </section>
</body>
</html>`;
}

async function generatePdfBuffer(formData) {
    const html = renderPdfHtml(formData);
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ],
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });

        await page.evaluateHandle('document.fonts.ready');

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '14mm',
                right: '10mm',
                bottom: '14mm',
                left: '10mm',
            },
        });

        return Buffer.from(pdf);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

app.post('/submit-form', async (req, res) => {
    const {
        patient_name,
        patient_phone,
        form_data,
    } = req.body || {};

    if (!form_data || !patient_name || !patient_phone) {
        return res.status(400).json({
            status: 'error',
            error:
                'Missing required fields: ' +
                'patient_name, patient_phone, form_data',
        });
    }

    let pdfBuffer;

    try {
        pdfBuffer = await generatePdfBuffer(form_data);
    } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);

        return res.status(500).json({
            status: 'error',
            error: `PDF render error: ${pdfError.message}`,
        });
    }

    const safeName =
        String(patient_name)
            .replace(/[^\p{L}\p{N}\-_ ]/gu, '')
            .trim() || 'patient';

    const fileName = `hijama-form-${safeName}.pdf`;

    try {
        const response = await resend.emails.send({
            from: mailFrom,
            to: mailTo,
            subject:
                `New Hijama Form Submission - ${patient_name}`,

            html: `
                <h2>New Hijama Form Submission</h2>

                <p>
                    <strong>Patient Name:</strong>
                    ${escapeHtml(patient_name)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(patient_phone)}
                </p>

                <p>
                    The completed Hijama PDF form is attached.
                </p>
            `,

            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer.toString('base64'),
                },
            ],
        });

        return res.status(200).json({
            status: 'success',
            message: 'Email sent successfully',
            response,
        });
    } catch (error) {
        console.error(
            'Error sending email with attachment:',
            error
        );

        return res.status(500).json({
            status: 'error',
            error: error.message,
        });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});