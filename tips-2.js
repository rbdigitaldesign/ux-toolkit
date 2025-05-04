function generateReport() {
  const interpretation = document.querySelector('input[name="interpretation"]:checked').value;
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');

  const checked = [];
  const unchecked = [];

  checkboxes.forEach(cb => (cb.checked ? checked : unchecked).push(cb.value));

  let implemented = [];
  let needsImprovement = [];
  let notAssessed = [];

  if (interpretation === 'implemented') {
    implemented = checked;
    notAssessed = unchecked;
  } else {
    needsImprovement = checked;
    notAssessed = unchecked;
  }

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

✅ Implemented UX features:
${implemented.map(i => '- ' + i).join('\n') || '- None indicated.'}

🔧 Recommended improvements:
${needsImprovement.map(i => '- ' + i).join('\n') || '- None identified in this review.'}

❓ Not assessed:
${notAssessed.map(i => '- ' + i).join('\n') || '- All items were reviewed.'}

📝 Additional suggestions from the designer:
${notes || '[No additional notes provided]'}
`;

  document.getElementById('output').value = output.trim();
}

function copyReport() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = new Image();
  logo.src = 'AU logo primary_white.png';

  logo.onload = () => {
    doc.setFillColor(22, 12, 80);
    doc.rect(0, 0, 210, 30, 'F');
    doc.addImage(logo, 'PNG', 10, 5, 40, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const text = document.getElementById('output').value;
    const lines = doc.splitTextToSize(text, 180);
    let y = 40;
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 7;
    });

    doc.save('UX-checklist-report.pdf');
  };
}
