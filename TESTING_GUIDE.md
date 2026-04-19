# Testing Guide: Puppeteer PDF Generation

## Prerequisites

- Node.js 14+ installed
- npm dependencies installed: `npm install` (already done)
- Gmail account configured in server.js
- Internet connection (for Google Fonts CDN)

## Quick Start

### 1. Start the Server

```bash
npm start
```

You should see:
```
Server running on port 3000
```

### 2. Open in Browser

Navigate to:
```
http://localhost:3000
```

You should see the Hijama form with all fields.

## Testing Scenarios

### Scenario 1: Basic Form Submission (English Names)

1. **Fill in basic information:**
   - Name: John Smith
   - Age: 35
   - Gender: Male
   - Phone: +1-555-0100
   - Address: 123 Main St, New York

2. **Medical History:**
   - Check: High Blood Pressure, Diabetes
   - Other: History of migraines

3. **Medications:**
   - Taking Meds: Yes
   - Med List: Metformin, Lisinopril
   - Blood Thinners: No

4. **Contraindications:**
   - Check: None
   - Other: Patient allergic to adhesive

5. **Tests:**
   - Recent Blood Test: Yes
   - Details: Normal, 3 months ago

6. **Reason for Cupping:**
   - Pain Location: Lower back pain
   - Previous Cupping: Yes, 1 year ago

7. **Clinical Exam:**
   - Temperature: 98.6°F
   - BP: 140/90
   - Pain Level: 7/10
   - Physical Exam: Yes

8. **Signature:**
   - Name: John Smith
   - Date: 2024-04-19

**Expected Result:**
- ✅ Form submits without errors
- ✅ Loading spinner appears
- ✅ Success message appears
- ✅ Email sent to tclinic65@gmail.com with PDF attachment
- ✅ PDF displays all entered data
- ✅ Arabic labels render correctly

---

### Scenario 2: Arabic Text Testing

1. **Fill with Arabic names:**
   - Name: محمد علي
   - Address: الرياض، المملكة العربية السعودية
   - Other Diseases: أمراض أخرى
   - Meds List: الأنسولين، مرخيات العضلات

2. **Submit form**

**Expected Result:**
- ✅ Arabic text renders correctly in PDF
- ✅ RTL layout is proper
- ✅ No text reversal
- ✅ Professional appearance

---

### Scenario 3: Empty Fields Handling

1. **Leave many fields empty**
   - Name: Jane Doe
   - Phone: +1-555-0101
   - Leave medical history empty
   - Leave medications empty

2. **Submit form**

**Expected Result:**
- ✅ Form accepts submission
- ✅ Empty fields show "لا يوجد" (Not available)
- ✅ PDF displays properly formatted empty fields

---

### Scenario 4: Long Text Handling

1. **Fill with long text:**
   - Medical History: Patient has extensive history of joint pain, arthritis, and previous surgical interventions
   - Other Diseases: Long list of conditions including but not limited to chronic fatigue, fibromyalgia, and nerve damage

2. **Submit form**

**Expected Result:**
- ✅ Text wraps properly in PDF
- ✅ No overflow or cut-off text
- ✅ Professional formatting maintained

---

### Scenario 5: Special Characters

1. **Include special characters:**
   - Name: O'Brien-Smith
   - Phone: +1 (555) 012-0100
   - Meds: Medication (50mg/day)
   - Address: "Downtown" Area - Unit #5

2. **Submit form**

**Expected Result:**
- ✅ Special characters display correctly
- ✅ No encoding issues
- ✅ Email attachment created without errors

---

## Verification Checklist

### Browser Console
```javascript
// Check for errors in browser console
// Open DevTools: F12 or Ctrl+Shift+I
// Should see NO errors
```

### Server Console
```javascript
// Check server output for success messages:
// "Generating PDF for: [patient name]"
// "PDF generated successfully, size: [bytes]"
// "Email sent successfully"
```

### Email Verification
1. Check inbox: tclinic65@gmail.com
2. Look for: "New Hijama Form Submission - [Patient Name]"
3. Open attachment (PDF file)
4. Verify:
   - All fields present
   - Proper Arabic rendering
   - Professional formatting
   - All data correctly displayed

### PDF Verification
Check the PDF for:
- ✅ Title: "نموذج استقبال مريض الحجامة"
- ✅ Header section with document info
- ✅ All 10 sections present:
  1. Basic Information
  2. Medical History
  3. Medications
  4. Contraindications
  5. Medical Tests
  6. Reason for Cupping
  7. Clinical Examination
  8. Signature Section
  9. Footer with timestamp
- ✅ Proper RTL layout
- ✅ Clean typography
- ✅ Professional colors (#2c3e50)

## Performance Testing

### Measure PDF Generation Time

Add timing to browser console:

```javascript
// In browser DevTools Console
const start = performance.now();

// Submit form
// [form submits and you get success message]

// Check server logs for timing or:
// Estimate: browser response time - network latency = generation time
```

Expected:
- First PDF: 2-3 seconds
- Subsequent PDFs: 1-2 seconds
- Total with email: 5-10 seconds

## Troubleshooting

### Issue: "Cannot find module 'puppeteer'"

**Solution:**
```bash
npm install puppeteer
npm rebuild puppeteer
```

### Issue: "Browser launch failed"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall puppeteer
npm install puppeteer@latest
```

### Issue: "Email not sending"

**Check:**
1. Gmail credentials in server.js (line 19-20)
2. App password is correct (not regular password)
3. 2FA enabled on Gmail account
4. Internet connectivity

### Issue: "PDF is empty or blank"

**Check:**
1. Form data is being sent (check network tab in DevTools)
2. Server logs show PDF generation
3. HTML template loads correctly
4. Google Fonts CDN is accessible

### Issue: "Arabic text looks wrong"

**Check:**
1. Browser supports RTL text
2. Google Fonts (Cairo) loading (check network tab)
3. HTML has `dir="rtl"` and `lang="ar"`
4. CSS has `direction: rtl` and `text-align: right`

## Network Testing

### Check API Request

Open DevTools (F12) → Network tab → Submit form

**Request:**
- Method: POST
- URL: /submit-form
- Content-Type: application/json
- Body: Contains patient_name, patient_phone, formData object

**Response:**
- Status: 200
- Body: `{ "status": "success", "message": "Form submitted and email sent successfully" }`

### Monitor Payload Size

```javascript
// In browser console
// Check JSON size before sending
const data = {
    patient_name: "John Smith",
    patient_phone: "+1-555-0100",
    formData: { /* all form fields */ }
};
const jsonString = JSON.stringify(data);
console.log('Payload size:', jsonString.length, 'bytes');
```

Typical size: 2-5 KB

## Security Testing

### Test Input Sanitization

Try submitting with:
- XSS attempt: `<script>alert('xss')</script>`
- HTML tags: `<h1>Test</h1>`
- Special chars: `'; DROP TABLE --`

**Expected Result:**
- ✅ All inputs escaped
- ✅ No code execution
- ✅ Safe email content
- ✅ PDF displays escaped text correctly

## Automated Testing (Optional)

### Create Test Script

```javascript
// test-form.js
const fetch = require('node-fetch');

const testData = {
    patient_name: 'Test Patient',
    patient_phone: '+1-555-0100',
    formData: {
        patientName: 'Test Patient',
        patientAge: '30',
        patientGender: 'Male',
        patientPhone: '+1-555-0100',
        patientAddress: 'Test Address',
        medicalHistory: ['Hypertension'],
        // ... include all fields
    }
};

fetch('http://localhost:3000/submit-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    if (data.status === 'success') {
        console.log('✅ Test PASSED');
    } else {
        console.log('❌ Test FAILED:', data.error);
    }
})
.catch(err => console.log('❌ Error:', err.message));
```

Run:
```bash
node test-form.js
```

## Load Testing

### Multiple Submissions

Test with multiple rapid submissions:

```javascript
// In browser console
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        // Submit form programmatically or manually
        document.getElementById('submitBtn').click();
    }, i * 15000); // 15 seconds apart
}
```

**Expected Result:**
- ✅ All PDFs generated successfully
- ✅ All emails sent
- ✅ Server handles concurrent requests
- ✅ No memory leaks

## Final Verification Checklist

- [ ] Server starts without errors
- [ ] Form loads in browser
- [ ] Form submits successfully
- [ ] PDF generates in 1-3 seconds
- [ ] Email arrives with PDF attachment
- [ ] PDF contains all form data
- [ ] Arabic text renders correctly
- [ ] No console errors in browser
- [ ] No errors in server logs
- [ ] Special characters handled properly
- [ ] Long text wraps correctly
- [ ] Empty fields display properly
- [ ] Professional formatting maintained

## Success Criteria

All tests pass ✅ = **Production Ready**

If any test fails, check the troubleshooting section or the PUPPETEER_MIGRATION.md documentation.

---

**Testing Status**: Ready for QA
**Last Updated**: 2024
