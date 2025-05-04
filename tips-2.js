// Get reference to jsPDF library
const { jsPDF } = window.jspdf;

// Function to generate the report text
function generateReport() {
  // Get form values
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const designer = document.getElementById('designerName').value.trim();
  const notes = document.getElementById('notes').value.trim();

  // Get all slider ratings and associated questions
  const items = document.querySelectorAll('.rating-item');
  let ratings = [];

  items.forEach(item => {
    const question = item.querySelector('label').innerText;
    const score = item.querySelector('input').value;
    ratings.push({ question, score: parseInt(score) });
  });

  // Categorise by score
  const green = ratings.filter(r => r.score >= 8);
  const yellow = ratings.filter(r => r.score >= 5 && r.score < 8);
  const red = ratings.filter(r => r.score < 5);

  // Format the report
  const output = `
Canvas UX Review Summary

This report was prepared by ${designer || '[Designer Name]'} as a review of UX practices for the course "${course || '[Course Name]'}", developed by ${builder || '[Course Builder]'}.

Page reviewed: ${url || '[Page URL]'}

The ratings below reflect the quality of user experience based on key Canvas LMS principles. Ratings are on a scale of 1 (poor) to 10 (excellent).

✅ Well-implemented areas (score 8–10):
${green.map(i => `- ${i.question} (Score: ${i.score})`).join('\n') || '- None'}

⚠️ Areas that could be improved (score 5–7):
${yellow.map(i => `- ${i.question} (Score: ${i.score})`).join('\n') || '- None'}

❗ Critical areas needing attention (score 1–4):
${red.map(i => `- ${i.question} (Score: ${i.score})`).join('\n') || '- None'}

📝 Additional notes:
${notes || '[No additional notes provided]'}
  `.trim();

  document.getElementById('output').value = output;
}

// Copy report text to clipboard
function copyReport() {
  const text = document.getElementById('output');
  text.select();
  document.execCommand('copy');
}

// Export report to PDF
function downloadPDF() {
  const doc = new jsPDF();
  const logo = new Image();
  logo.src = 'AU logo primary_white.png';

  logo.onload = () => {
    // Header with background colour and logo
    doc.setFillColor(22, 12, 80); // #160c50
    doc.rect(0, 0, 210, 35, 'F');
    doc.addImage(logo, 'PNG', 10, 6, 40, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Canvas UX Review Summary", 105, 25, { align: 'center' });

    // Report body text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(document.getElementById('output').value, 180);

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