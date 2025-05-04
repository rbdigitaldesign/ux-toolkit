function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const interpretation = document.querySelector('input[name="interpretation"]:checked')?.value || 'implemented';

  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const checkedItems = [];
  const uncheckedItems = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      checkedItems.push(checkbox.value);
    } else {
      uncheckedItems.push(checkbox.value);
    }
  });

  let implemented = [];
  let recommended = [];

  if (interpretation === 'implemented') {
    implemented = checkedItems;
    recommended = uncheckedItems;
  } else {
    implemented = uncheckedItems;
    recommended = checkedItems;
  }

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name']}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

🔍 Interpretation mode selected: ${interpretation === 'implemented' ? '✓ = Implemented' : '✓ = Needs Improvement'}

✅ UX features currently implemented:
${implemented.length ? implemented.map(i => '- ' + i).join('\n') : '- No items recorded.'}

🔧 Recommended improvements:
${recommended.length ? recommended.map(i => '- ' + i).join('\n') : '- No items recorded.'}

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
    doc.rect(0, 0, 210, 30, 'F');
    doc.addImage(logo, 'PNG', 10, 5, 40, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
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
