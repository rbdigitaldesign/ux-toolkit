// Capture interpretation mode for the report
function getInterpretationMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

// Generate the UX report content based on selections
function generateReport() {
  const mode = getInterpretationMode();
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes')?.value.trim() || '';
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');

  const implemented = [];
  const recommended = [];

  // Interpret checkboxes according to mode
  checkboxes.forEach(cb => {
    if (mode === 'needsImprovement') {
      if (cb.checked) {
        recommended.push(cb.value);
      }
    } else {
      if (cb.checked) {
        implemented.push(cb.value);
      } else {
        recommended.push(cb.value);
      }
    }
  });

  // Format output with explanatory text
  const report = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support a discussion around UX design in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

It highlights what has been implemented well, and what may be improved to better support student experience.

✅ Implemented UX features:
${implemented.length ? implemented.map(i => '- ' + i).join('\n') : '- Not marked.'}

🔧 Recommended improvements:
${recommended.length ? recommended.map(i => '- ' + i).join('\n') : '- None noted.'}

📝 Additional notes:
${notes || '[No additional notes]'}
  `;

  document.getElementById('output').value = report.trim();
}

// Copy report to clipboard
function copyReport() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}

// Export to PDF with logo and header
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
    doc.setFontSize(14);
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
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
