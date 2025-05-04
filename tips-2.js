function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const mode = document.querySelector('input[name="mode"]:checked').value;

  const implemented = [];
  const recommended = [];
  const notAssessed = [];

  checkboxes.forEach(cb => {
    if (cb.checked && mode === "implemented") implemented.push(cb.value);
    else if (cb.checked && mode === "needsImprovement") recommended.push(cb.value);
    else notAssessed.push(cb.value);
  });

  const date = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });

  const report = `
Canvas UX Review Summary

Date of review: ${date}

This report was created by ${designer || '[Designer Name]'} to support a UX review of the Canvas LMS experience for "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

✅ Implemented UX features:
${implemented.length ? implemented.map(i => '- ' + i).join('\n') : '- None ticked as implemented.'}

🔧 Recommended improvements:
${recommended.length ? recommended.map(i => '- ' + i).join('\n') : '- No improvements suggested.'}

❓ Not assessed (neutral or unchecked):
${notAssessed.length ? notAssessed.map(i => '- ' + i).join('\n') : '- All items were assessed.'}

📝 Additional comments:
${notes || '[No additional comments provided]'}
  `.trim();

  document.getElementById('output').value = report;
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
    doc.setFillColor(22, 12, 80);
    doc.rect(0, 0, 210, 35, 'F');
    doc.addImage(logo, 'PNG', 10, 6, 40, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const text = document.getElementById('output').value;
    const lines = doc.splitTextToSize(text, 180);
    let y = 45;

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
