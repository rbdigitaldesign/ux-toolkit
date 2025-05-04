function generateReport() {
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const sliders = document.querySelectorAll('.checklist input[type="range"]');

  // Converts numeric value to qualitative label
  function labelForScore(score) {
    switch (parseInt(score)) {
      case 1: return 'Very Poor';
      case 2: return 'Needs Work';
      case 3: return 'Acceptable';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Unrated';
    }
  }

  const ratings = Array.from(sliders).map(slider => {
    const label = slider.closest('fieldset').querySelector('legend').innerText;
    const score = slider.value;
    return `- ${label}\n  Rating: ${score}/5 (${labelForScore(score)})`;
  });

  const output = `
Canvas UX Review Summary

This report was created by ${designer || '[Designer Name]'} to support the review of user experience (UX) considerations in the Canvas LMS for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

Each checklist item has been rated on a scale from 1 (Very Poor) to 5 (Excellent). These ratings help highlight areas of strong UX as well as opportunities for improvement.

${ratings.join('\n\n')}

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
    doc.setFillColor(22, 12, 80); // Dark purple header
    doc.rect(0, 0, 210, 35, 'F');
    doc.addImage(logo, 'PNG', 10, 6, 40, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
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
