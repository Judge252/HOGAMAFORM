// app.js

// Initialize EmailJS
// [IMPORTANT] Replace these with your actual keys from EmailJS dashboard
const EMAILJS_PUBLIC_KEY = "vNAW4MCkvSjEXUWXL"; 
const EMAILJS_SERVICE_ID = "service_ps8zeax";
const EMAILJS_TEMPLATE_ID = "template_ws7pyld";

emailjs.init(EMAILJS_PUBLIC_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('hijama-form');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const spinner = submitBtn.querySelector('.spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ensure form is valid before processing
        if (!form.checkValidity()) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'الرجاء تعبئة الحقول الإلزامية المطلوبة!',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#007aff'
            });
            return;
        }

        // Extract some basic info for the email message body
        const patientName = document.getElementById('fullName').value;
        const patientPhone = document.getElementById('phone').value;

        // UI Loading State
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        submitBtn.disabled = true;

        try {
            // Setup html2pdf options
            const captureArea = document.getElementById('capture-area');
            const opt = {
                margin:       [10, -5, 10, -5], // Minimal margins
                filename:     `Hijama_Form_${patientName}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Generate PDF as Base64 Data URI
            const pdfDataUri = await html2pdf().set(opt).from(captureArea).outputPdf('datauristring');

            // Send via EmailJS
            const templateParams = {
                patient_name: patientName,
                patient_phone: patientPhone,
                message: `تم استلام نموذج جديد للمريض ${patientName}`,
                content: pdfDataUri 
            };

            const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            
            if (result.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الإرسال بنجاح!',
                    text: 'تم إنشاء ملف PDF وإرساله.',
                    confirmButtonText: 'رائع',
                    confirmButtonColor: '#34c759'
                }).then(() => {
                    form.reset();
                    window.scrollTo(0,0);
                });
            } else {
                throw new Error(JSON.stringify(result));
            }

        } catch (error) {
            console.error('Submission Error:', error);
            // Extracted error message details depending on error type structure 
            let errorMsg = (error.text || error.message || (typeof error === 'object' ? JSON.stringify(error) : error));
            Swal.fire({
                icon: 'error',
                title: 'حدث خطأ في الإرسال',
                html: `<p>تفاصيل الخطأ: <br/><strong dir="ltr">${errorMsg}</strong></p>`,
                confirmButtonText: 'إغلاق',
                confirmButtonColor: '#ff3b30'
            });
        } finally {
            // Restore UI State
            btnText.style.display = 'inline-flex';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // Optional: Dynamic logic for radio buttons expanding text inputs
    // For example, if taking meds is "نعم", maybe auto-focus the medsList
    const medsRadios = document.querySelectorAll('input[name="takingMeds"]');
    const medsList = document.getElementById('medsList');
    
    medsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'نعم') {
                medsList.focus();
            }
        });
    });
});
