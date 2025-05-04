function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();

  const sliders = document.querySelectorAll('.checklist input[type="range"]');
  const categories = [];

  sliders.forEach(slider => {
    const label = slider.parentElement.querySelector('legend').textContent.trim();
    const value = parseInt(slider.value);
    let severity = "";

    if (value <= 1) severity = "❌ Critical";
    else if (value === 2) severity = "⚠ Needs Work";
    else if (value === 3) severity = "✅ Passable";
    else severity = "🌟 Ideal";

    categories.push(`${severity}: ${label}`);
  });

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to evaluate the user experience of the Canvas LMS course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}.

The checklist items below have been rated to help highlight priorities for improving student experience.

${categories.join('\n')}

📝 Additional comments:
${notes || '[No additional comments provided]'}
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
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const text = document.getElementById('output').value;
    const lines = doc.splitTextToSize(text, 180);
    let y = 45;
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 6;
    });

    doc.save('UX-checklist-report.pdf');
  };
}
