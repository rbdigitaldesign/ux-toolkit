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
  const mode = document.querySelector('input[name="interpretation"]:checked')?.value;

  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const implemented = [];
  const improvement = [];
  const unassessed = [];

  checkboxes.forEach(checkbox => {
    const label = checkbox.value;
    if (checkbox.checked) {
      if (mode === "implemented") {
        implemented.push(label);
      } else {
        improvement.push(label);
      }
    } else {
      unassessed.push(label);
    }
  });

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

The checklist highlights areas based on the selected interpretation mode: "${mode === 'implemented' ? 'Ticked = Implemented' : 'Ticked = Needs Improvement'}".

✅ Marked as Implemented:
${implemented.length ? implemented.map(i => '- ' + i).join('\n') : '- None'}

🔧 Marked as Needing Improvement:
${improvement.length ? improvement.map(i => '- ' + i).join('\n') : '- None'}

❓ Not assessed in this review:
${unassessed.length ? unassessed.map(i => '- ' + i).join('\n') : '- None'}

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
    doc.setFillColor(22, 12, 80); // dark blue background
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
