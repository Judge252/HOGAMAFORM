const { jsPDF } = require('jspdf');
const fs = require('fs');
const doc = new jsPDF();
const text = 'نموذج استقبال مريض الحجامة';
doc.text(text, 10, 10);
const pdf = doc.output();
fs.writeFileSync('tmp_test.pdf', pdf, 'binary');
console.log('PDF bytes length:', pdf.length);
