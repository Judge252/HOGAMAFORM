const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON
app.use(bodyParser.json({ limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tclinic65@gmail.com',
        pass: 'cdtfkgpzmgnwyghr',   // Your Gmail app password (spaces removed)
    }
});

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderHijamaHtml(formData) {
    const data = formData || {};
    const medicalHistory = Array.isArray(data.medicalHistory) ? data.medicalHistory : [];
    const contraindications = Array.isArray(data.contraindications) ? data.contraindications : [];

    const row = (label, value) => `
      <tr>
        <td class="value">${escapeHtml(value)}</td>
        <td class="label">${escapeHtml(label)}</td>
      </tr>
    `;

    const list = (items) => {
        if (!items.length) return '<div class="muted">لا يوجد</div>';
        return `<ul>${items.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
    };

    return `<!doctype html>
<html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      @page { size: A4; margin: 14mm; }
      body {
        direction: rtl;
        font-family: 'Cairo', sans-serif;
        color: #111827;
        font-size: 12pt;
      }
      h1 { font-size: 20pt; margin: 0 0 10px; }
      h2 { font-size: 14pt; margin: 18px 0 10px; }
      .meta { color: #374151; margin-bottom: 14px; }
      .card {
        border: 1px solid #E5E7EB;
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 12px;
      }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; vertical-align: top; }
      tr:last-child td { border-bottom: none; }
      .label { width: 34%; color: #6B7280; font-weight: 700; text-align: right; }
      .value { width: 66%; text-align: right; }
      ul { margin: 6px 0 0; padding: 0 18px 0 0; }
      li { margin: 3px 0; }
      .muted { color: #6B7280; }
    </style>
    <title>نموذج استقبال مريض الحجامة</title>
  </head>
  <body>
    <h1>نموذج استقبال مريض الحجامة</h1>
    <div class="meta">تاريخ الإنشاء: ${escapeHtml(new Date().toLocaleString('ar-EG'))}</div>

    <div class="card">
      <h2>البيانات الأساسية</h2>
      <table>
        ${row('الاسم', data.patientName)}
        ${row('العمر', data.patientAge)}
        ${row('الجنس', data.patientGender)}
        ${row('رقم الهاتف', data.patientPhone)}
        ${row('العنوان', data.patientAddress)}
      </table>
    </div>

    <div class="card">
      <h2>التاريخ الطبي</h2>
      <div>${list(medicalHistory)}</div>
      <table>
        ${row('أمراض أخرى', data.otherDiseases)}
        ${row('مشاكل صحية أخرى', data.otherProblems)}
      </table>
    </div>

    <div class="card">
      <h2>الأدوية</h2>
      <table>
        ${row('هل يتناول أدوية؟', data.takingMeds)}
        ${row('أسماء الأدوية', data.medsList)}
        ${row('مميعات الدم', data.bloodThinners)}
      </table>
    </div>

    <div class="card">
      <h2>موانع الحجامة</h2>
      <div>${list(contraindications)}</div>
      <table>
        ${row('أخرى', data.otherContraindications)}
      </table>
    </div>

    <div class="card">
      <h2>الفحوصات الطبية</h2>
      <table>
        ${row('فحوصات دم خلال الستة أشهر الماضية', data.recentBloodTest)}
        ${row('تفاصيل الفحوصات', data.bloodTestIssues)}
      </table>
    </div>

    <div class="card">
      <h2>سبب طلب الحجامة</h2>
      <table>
        ${row('الألم / مكانه', data.painLocation)}
        ${row('السابق إجراء حجامة', data.previousCupping)}
      </table>
    </div>

    <div class="card">
      <h2>الفحص السريري (العيادة)</h2>
      <table>
        ${row('الحرارة', data.temperature)}
        ${row('ضغط الدم والنبض', data.bloodPressure)}
        ${row('مستوى الألم', data.painLevel)}
        ${row('فحص يدوي للمريض', data.physicalExamCheck)}
      </table>
    </div>

    <div class="card">
      <h2>إقرار المريض</h2>
      <table>
        ${row('اسم الموقّع', data.signatureName)}
        ${row('التاريخ', data.signatureDate)}
      </table>
    </div>
  </body>
</html>`;
}

async function renderPdfBufferFromHtml(html) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                // Railway / Docker often have small /dev/shm; avoids Chromium crashes under load
                '--disable-dev-shm-usage',
            ],
        });
    } catch (launchErr) {
        const wrapped = new Error(
            `Failed to launch Chromium for PDF: ${launchErr.message}`
        );
        wrapped.cause = launchErr;
        throw wrapped;
    }

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfUint8 = await page.pdf({
            format: 'A4',
            printBackground: true,
        });
        return Buffer.from(pdfUint8);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// POST route to handle form submission
app.post('/submit-form', (req, res) => {
    try {
        const { patient_name, patient_phone, form_data } = req.body;
        if (!form_data) {
            return res.status(400).json({ status: 'error', error: 'No form data received' });
        }

        // Generate a unique filename for the PDF
        const pdfFilename = `Hijama_Form_${patient_name}_${Date.now()}.pdf`;
        const pdfFilePath = path.join(__dirname, 'generated_pdfs', pdfFilename);

        // Ensure generated_pdfs directory exists
        const pdfDir = path.join(__dirname, 'generated_pdfs');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        const html = renderHijamaHtml(form_data);
        renderPdfBufferFromHtml(html).then((buffer) => {
            fs.writeFileSync(pdfFilePath, buffer);
            console.log('PDF saved:', pdfFilePath);

            const mailOptions = {
                from: 'tclinic65@gmail.com',
                to: 'tclinic65@gmail.com',
                subject: `New Hijama Form Submission - ${patient_name}`,
                text: `New form submitted for patient: ${patient_name}, Phone: ${patient_phone}`,
                html: `
                    <h2>New Hijama Form Submission</h2>
                    <p><strong>Patient Name:</strong> ${escapeHtml(patient_name)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(patient_phone)}</p>
                    <p>Please find the PDF attachment with the complete form details.</p>
                `,
                attachments: [
                    {
                        filename: pdfFilename,
                        content: buffer,
                        contentType: 'application/pdf',
                    },
                ],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ status: 'error', error: `Email error: ${error.message}` });
                }

                console.log('Email sent successfully:', info.response);

                try {
                    fs.unlinkSync(pdfFilePath);
                } catch (unlinkErr) {
                    console.warn('Could not delete temp PDF:', unlinkErr.message);
                }

                res.status(200).json({ status: 'success', message: 'Email sent successfully' });
            });
        }).catch((err) => {
            console.error('PDF render error:', err);
            return res.status(500).json({ status: 'error', error: `PDF render error: ${err.message}` });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});