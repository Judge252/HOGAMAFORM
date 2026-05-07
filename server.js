const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const resend = new Resend('re_3gx1rifZ_M7NKujrEXW7MMaDnh4fA8PB4'); // Your Resend API Key

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Form submission route
app.post('/submit-form', async (req, res) => {
    const formData = req.body;

    try {
        // Create the email body, for example, using the collected form data
        const emailBody = `Patient Name: ${formData.patient_name}\nPhone: ${formData.patient_phone}\n...`;

        // Send email using Resend API
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // Sender's email address
            to: 'tclinic65@gmail.com', // Receiver's email address
            subject: 'New Hijama Form Submission',
            html: `<p>${emailBody}</p>`, // You can use HTML or plain text as needed
        });

        res.status(200).json({ status: 'success', message: 'Email sent successfully', response });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});