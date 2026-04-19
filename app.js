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



        const addLabelValue = (label, value) => {
            addWrappedText(`${label}: ${value}`);
        };

        const newPageIfNeeded = () => {
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 18;
            }
        };

        // Title
        doc.setFontSize(18);
        doc.setFont('ArabType', 'normal');
        addWrappedText('نموذج استقبال مريض الحجامة');
        y += 2;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Basic Info
        doc.setFontSize(14);
        addWrappedText('البيانات الأساسية');
        y += 3;
        doc.setFontSize(12);

        addLabelValue('الاسم', data.patientName);
        addLabelValue('العمر', data.patientAge);
        addLabelValue('الجنس', data.patientGender);
        addLabelValue('رقم الهاتف', data.patientPhone);
        addLabelValue('العنوان', data.patientAddress);
        y += 4;
        newPageIfNeeded();

        // Medical History
        addWrappedText('التاريخ الطبي');
        y += 3;
        if (data.medicalHistory.length) {
            data.medicalHistory.forEach(item => addWrappedText(`- ${item}`));
        } else {
            addWrappedText('لا توجد أمراض مدرجة');
        }
        addLabelValue('أمراض أخرى', data.otherDiseases);
        addLabelValue('مشاكل صحية أخرى', data.otherProblems);
        y += 4;
        newPageIfNeeded();

        // Medications
        addWrappedText('الأدوية');
        y += 3;
        addLabelValue('هل يتناول أدوية؟', data.takingMeds);
        addLabelValue('أسماء الأدوية', data.medsList);
        addLabelValue('مميعات الدم', data.bloodThinners);
        y += 4;
        newPageIfNeeded();

        // Contraindications
        addWrappedText('موانع الحجامة');
        y += 3;
        if (data.contraindications.length) {
            data.contraindications.forEach(item => addWrappedText(`- ${item}`));
        } else {
            addWrappedText('لا توجد موانع مسجلة');
        }
        addLabelValue('أخرى', data.otherContraindications);
        y += 4;
        newPageIfNeeded();

        // Medical Tests
        addWrappedText('الفحوصات الطبية');
        y += 3;
        addLabelValue('فحوصات دم خلال الستة أشهر الماضية', data.recentBloodTest);
        addLabelValue('تفاصيل الفحوصات', data.bloodTestIssues);
        y += 4;
        newPageIfNeeded();

        // Reason for Cupping
        addWrappedText('سبب طلب الحجامة');
        y += 3;
        addLabelValue('الألم / مكانه', data.painLocation);
        addLabelValue('السابق إجراء حجامة', data.previousCupping);
        y += 4;
        newPageIfNeeded();

        // Clinical Exam
        doc.setFont('ArabType', 'normal');
        addWrappedText('الفحص السريري');
        y += 3;
        doc.setFont('ArabType', 'normal');
        addLabelValue('الحرارة', data.temperature);
        addLabelValue('ضغط الدم والنبض', data.bloodPressure);
        addLabelValue('مستوى الألم', data.painLevel);
        addLabelValue('فحص يدوي للمريض', data.physicalExamCheck);
        y += 4;
        newPageIfNeeded();

        // Patient Declaration
        doc.setFont('ArabType', 'normal');
        addWrappedText('إقرار المريض');
        y += 3;
        doc.setFont('ArabType', 'normal');
        addLabelValue('اسم الموقّع', data.signatureName);
        addLabelValue('التاريخ', data.signatureDate);

        // Never use datauristring for transport: jsPDF falls back to
        // btoa(unescape(encodeURIComponent(...))) when btoa throws, which
        // re-encodes binary as UTF-8 text and corrupts the PDF (garbled / þ).
        const pdfArrayBuffer = doc.output('arraybuffer');
        return arrayBufferToBase64(pdfArrayBuffer);
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
            // Send form data to backend for PDF generation
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_name: data.patientName,
                    patient_phone: data.patientPhone,
                    formData: data
                })
            });

            const result = await response.json();

            if (result.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'تم الإرسال بنجاح!',
                    text: 'تم إنشاء ملف PDF وإرساله عبر البريد الإلكتروني.',
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
