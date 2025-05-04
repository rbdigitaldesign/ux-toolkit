function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');

  const implemented = [];
  const recommended = [];

  checkboxes.forEach(checkbox => {
    (checkbox.checked ? implemented : recommended).push(checkbox.value);
  });

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

The checklist highlights areas that are currently implemented and areas that could be improved to support better student navigation, accessibility, and user experience.

✅ Implemented UX features:
${implemented.map(i => '- ' + i).join('\n') || '- None yet checked.'}

🔧 Recommended improvements:
${recommended.map(i => '- ' + i).join('\n') || '- None. All items are checked.'}

📝 Additional suggestions from the designer:
${notes || '[No additional notes provided]'}
  `;

  document.getElementById('output').value = output.trim();
}

function copyReport() {
  const text = document.getElementById('output');
  text.select();
  document.execCommand('copy');
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const logo = new Image();
  logo.src = 'AU logo primary_white.png';
  logo.onload = () => {
    doc.setFillColor(22, 12, 80); // #160c50
    doc.rect(0, 0, 210, 30, 'F');
    doc.addImage(logo, 'PNG', 75, 5, 60, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Canvas UX Review Summary", 105, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    const text = document.getElementById('output').value;
    const lines = doc.splitTextToSize(text, 180);
    doc.setFontSize(10);
    doc.text(lines, 15, 40);

    doc.save('UX-checklist-report.pdf');
  };
}
