function revealChecklist() {
  const selected = document.getElementById('interpretationMode').value;
  document.getElementById('checklistSection').style.display = selected ? 'block' : 'none';
}

function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const interpretation = document.getElementById('interpretationMode').value;
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');

  const checked = [], unchecked = [];

  checkboxes.forEach(cb => {
    (cb.checked ? checked : unchecked).push(cb.value);
  });

  let implemented = [], recommended = [];

  if (interpretation === 'implemented') {
    implemented = checked;
    recommended = unchecked;
  } else if (interpretation === 'needsImprovement') {
    implemented = unchecked;
    recommended = checked;
  }

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

The checklist highlights UX features already considered in the course design, as well as suggestions for future improvement based on the selected interpretation mode.

✅ Implemented UX features:
${implemented.map(i => '- ' + i).join('\n') || '- None'}

🔧 Recommended improvements:
${recommended.map(i => '- ' + i).join('\n') || '- None'}

📝 Additional notes from the designer:
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
