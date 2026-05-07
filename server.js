require('dotenv').config();

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

function renderPdfHtml(formData) {
    const data = formData || {};
    const medicalHistory = Array.isArray(data.medicalHistory) ? data.medicalHistory : [];
    const contraindications = Array.isArray(data.contraindications) ? data.contraindications : [];

    const row = (label, value) => `
      <tr>
        <td class="label">${escapeHtml(label)}</td>
        <td class="value">${escapeHtml(value)}</td>
      </tr>
    `;

    const list = (items) =>
        items.length
            ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
            : '<div class="muted">لا يوجد</div>';

    return `<!doctype html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @page { size: A4; margin: 14mm; }
    body {
      direction: rtl;
      font-family: "Tahoma", "Arial", sans-serif;
      color: #111827;
      line-height: 1.6;
      font-size: 13px;
    }
    h1 { margin: 0 0 8px; font-size: 24px; }
    h2 { margin: 14px 0 8px; font-size: 17px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .meta { color: #4b5563; margin-bottom: 10px; }
    .section { margin-bottom: 12px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 6px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    .label { width: 30%; font-weight: 700; color: #374151; }
    .value { width: 70%; }
    ul { margin: 6px 0; padding: 0 18px 0 0; }
    .muted { color: #6b7280; }
  </style>
</head>
<body>
  <h1>نموذج استقبال مريض الحجامة</h1>
  <div class="meta">تاريخ الإنشاء: ${escapeHtml(new Date().toLocaleString('ar-EG'))}</div>

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
      ${row('فحوصات دم خلال الستة أشهر الماضية', data.recentBloodTest)}
      ${row('تفاصيل الفحوصات', data.bloodTestIssues)}
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
</body>
</html>`;
}

async function generatePdfBuffer(formData) {
    const html = renderPdfHtml(formData);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '14mm', right: '10mm', bottom: '14mm', left: '10mm' },
        });
        return Buffer.from(pdf);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Form submission route
app.post('/submit-form', async (req, res) => {
    const { patient_name, patient_phone, form_data } = req.body || {};

    if (!form_data || !patient_name || !patient_phone) {
        return res.status(400).json({
            status: 'error',
            error: 'Missing required fields: patient_name, patient_phone, form_data',
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

    const safeName = String(patient_name).replace(/[^\p{L}\p{N}\-_ ]/gu, '').trim() || 'patient';
    const fileName = `hijama-form-${safeName}.pdf`;

    try {
        const response = await resend.emails.send({
            from: mailFrom,
            to: mailTo,
            subject: `New Hijama Form Submission - ${patient_name}`,
            html: `
              <h2>New Hijama Form Submission</h2>
              <p><strong>Patient Name:</strong> ${escapeHtml(patient_name)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(patient_phone)}</p>
              <p>The completed Hijama PDF form is attached.</p>
            `,
            attachments: [
                {
                    filename: fileName,
                    content: pdfBuffer.toString('base64'),
                },
            ],
        });

        return res.status(200).json({ status: 'success', message: 'Email sent successfully', response });
    } catch (error) {
        console.error('Error sending email with attachment:', error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});