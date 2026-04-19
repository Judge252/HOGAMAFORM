// app.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('hijama-form');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const spinner = submitBtn.querySelector('.spinner');

    const getCheckboxValues = (name) => {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
    };

    const collectFormData = () => {
        return {
            patientName: document.getElementById('fullName').value.trim(),
            patientPhone: document.getElementById('phone').value.trim(),
            patientAddress: document.getElementById('address').value.trim() || 'غير محدد',
            patientGender: document.querySelector('input[name="gender"]:checked')?.value || 'غير محدد',
            patientAge: document.getElementById('age').value.trim() || 'غير محدد',
            medicalHistory: getCheckboxValues('medicalHistory[]'),
            contraindications: getCheckboxValues('contraindications[]'),
            takingMeds: document.querySelector('input[name="takingMeds"]:checked')?.value || 'غير محدد',
            medsList: document.getElementById('medsList').value.trim() || 'لا يوجد',
            bloodThinners: document.querySelector('input[name="bloodThinners"]:checked')?.value || 'غير محدد',
            otherDiseases: document.getElementById('otherDiseases').value.trim() || 'لا يوجد',
            otherProblems: document.getElementById('otherProblems').value.trim() || 'لا يوجد',
            otherContraindications: document.getElementById('otherContraindications').value.trim() || 'لا يوجد',
            recentBloodTest: document.querySelector('input[name="recentBloodTest"]:checked')?.value || 'غير محدد',
            bloodTestIssues: document.getElementById('bloodTestIssues').value.trim() || 'لا يوجد',
            painLocation: document.getElementById('painLocation').value.trim() || 'لا يوجد',
            previousCupping: document.getElementById('previousCupping').value.trim() || 'لا يوجد',
            temperature: document.getElementById('temperature').value.trim() || 'لا يوجد',
            bloodPressure: document.getElementById('bloodPressure').value.trim() || 'لا يوجد',
            painLevel: document.getElementById('painLevel').value.trim() || 'لا يوجد',
            physicalExamCheck: document.querySelector('input[name="physicalExamCheck"]')?.checked ? 'نعم' : 'لا',
            signatureName: document.getElementById('signatureName').value.trim(),
            signatureDate: document.getElementById('signatureDate').value || 'غير محدد'
        };
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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

        const data = collectFormData();

        btnText.style.display = 'none';
        spinner.style.display = 'block';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_name: data.patientName,
                    patient_phone: data.patientPhone,
                    form_data: data,
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الإرسال بنجاح!',
                    text: 'تم إنشاء ملف PDF وإرساله.',
                    confirmButtonText: 'رائع',
                    confirmButtonColor: '#34c759'
                }).then(() => {
                    form.reset();
                    window.scrollTo(0, 0);
                });
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'حدث خطأ في الإرسال',
                html: `<p>تفاصيل الخطأ: <br/><strong dir="ltr">${error.message || error}</strong></p>`,
                confirmButtonText: 'إغلاق',
                confirmButtonColor: '#ff3b30'
            });
        } finally {
            btnText.style.display = 'inline-flex';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    const medsRadios = document.querySelectorAll('input[name="takingMeds"]');
    const medsList = document.getElementById('medsList');

    medsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'نعم') {
                medsList.focus();
            }
        });
    });
});
