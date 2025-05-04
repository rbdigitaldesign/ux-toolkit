function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const mode = document.getElementById('checkMode').value;

  const implemented = [];
  const recommended = [];

  checkboxes.forEach(checkbox => {
    if (mode === 'checked-implemented') {
      (checkbox.checked ? implemented : recommended).push(checkbox.value);
    } else {
      (checkbox.checked ? recommended : implemented).push(checkbox.value);
    }
  });

  const modeExplanation = mode === 'checked-implemented'
    ? "In this mode, checked items are considered implemented. Unchecked items are recommendations for improvement."
    : "In this mode, checked items are flagged as needing improvement. Unchecked items are considered satisfactory.";

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

Interpretation mode: ${modeExplanation}

✅ Implemented UX features:
${implemented.map(i => '- ' + i).join('\n') || '- None listed.'}

🔧 Recommended improvements:
${recommended.map(i => '- ' + i).join('\n') || '- None listed.'}

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
    // Header section
    doc.setFillColor(22, 12, 80); // #160c50
    doc.rect(0, 0, 210, 35, 'F');
    doc.addImage(logo, 'PNG', 10, 6, 40, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    // Body setup
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

// Toggle mode description updater
document.addEventListener('DOMContentLoaded', function () {
  const modeSelect = document.getElementById('checkMode');
  const desc = document.getElementById('modeDescription');

  if (modeSelect && desc) {
    modeSelect.addEventListener('change', function () {
      desc.textContent = this.value === 'checked-implemented'
        ? 'When you tick a box, it will be counted as an implemented UX feature. Unticked boxes will be considered recommended improvements.'
        : 'When you tick a box, it will be flagged as needing improvement. Unticked boxes will be considered satisfactory.';
    });
  }
});
