const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { generatePDFFromData } = require('./pdf-generator');

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

// POST route to handle form submission with Puppeteer PDF generation
app.post('/submit-form', async (req, res) => {
    try {
        const { patient_name, patient_phone, formData } = req.body;

        if (!patient_name || !patient_phone) {
            return res.status(400).json({ status: 'error', error: 'Missing patient name or phone' });
        }

        if (!formData) {
            return res.status(400).json({ status: 'error', error: 'No form data received' });
        }

        console.log('Generating PDF for:', patient_name);

        // Generate PDF from form data using Puppeteer
        const pdfBuffer = await generatePDFFromData(formData);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            return res.status(500).json({ status: 'error', error: 'PDF generation produced empty buffer' });
        }

        console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

        // Generate filename
        const pdfFilename = `Hijama_Form_${patient_name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

        // Send email with PDF attachment
        const mailOptions = {
            from: 'tclinic65@gmail.com',
            to: 'tclinic65@gmail.com',
            subject: `New Hijama Form Submission - ${patient_name}`,
            text: `New form submitted for patient: ${patient_name}, Phone: ${patient_phone}`,
            html: `
                <h2>New Hijama Form Submission</h2>
                <p><strong>Patient Name:</strong> ${escapeHtmlEmail(patient_name)}</p>
                <p><strong>Phone:</strong> ${escapeHtmlEmail(patient_phone)}</p>
                <p>Please find the PDF attachment with the complete form details.</p>
            `,
            attachments: [
                {
                    filename: pdfFilename,
                    content: pdfBuffer,
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
            res.status(200).json({ status: 'success', message: 'Form submitted and email sent successfully' });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

/**
 * Escape HTML special characters for email
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtmlEmail(text) {
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
