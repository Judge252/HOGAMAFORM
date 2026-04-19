const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
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

// POST route to handle form submission
app.post('/submit-form', (req, res) => {
    try {
        const { patient_name, patient_phone, pdf_base64 } = req.body;

        if (!pdf_base64) {
            return res.status(400).json({ status: 'error', error: 'No PDF data received' });
        }

        // Generate a unique filename for the PDF
        const pdfFilename = `Hijama_Form_${patient_name}_${Date.now()}.pdf`;
        const pdfFilePath = path.join(__dirname, 'generated_pdfs', pdfFilename);

        // Ensure generated_pdfs directory exists
        const pdfDir = path.join(__dirname, 'generated_pdfs');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        // Strip data-URI prefix if present; never treat PDF bytes as UTF-8 text.
        let base64Data = String(pdf_base64).trim();
        const b64Marker = 'base64,';
        const markerIdx = base64Data.indexOf(b64Marker);
        if (markerIdx !== -1) {
            base64Data = base64Data.slice(markerIdx + b64Marker.length);
        } else if (base64Data.includes(',')) {
            base64Data = base64Data.split(',').pop();
        }
        base64Data = base64Data.replace(/\s/g, '');

        const buffer = Buffer.from(base64Data, 'base64');
        if (buffer.length < 8 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
            return res.status(400).json({ status: 'error', error: 'Invalid PDF payload (missing %PDF header after decode)' });
        }

        fs.writeFileSync(pdfFilePath, buffer);
        console.log('PDF saved:', pdfFilePath);

        const mailOptions = {
            from: 'tclinic65@gmail.com',
            to: 'tclinic65@gmail.com',
            subject: `New Hijama Form Submission - ${patient_name}`,
            text: `New form submitted for patient: ${patient_name}, Phone: ${patient_phone}`,
            html: `
                <h2>New Hijama Form Submission</h2>
                <p><strong>Patient Name:</strong> ${patient_name}</p>
                <p><strong>Phone:</strong> ${patient_phone}</p>
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