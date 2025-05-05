// Grabs values and builds a structured report
function generateReport() {
  const designer = document.getElementById('designerName').value.trim();
  const course = document.getElementById('courseName').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const builder = document.getElementById('courseBuilder').value.trim();
  const notes = document.getElementById('notes').value.trim();

  const blocks = document.querySelectorAll('.category-block');
  let report = `Canvas UX & Course Experience Report

Course: ${course || '[Course name]'}
Page reviewed: ${url || '[Page URL]'}
Course builder: ${builder || '[Course builder name]'}
Completed by: ${designer || '[Designer name]'}

`;

  blocks.forEach(block => {
    const title = block.querySelector('h2').textContent;
    const sliders = block.querySelectorAll('input[type="range"]');
    report += `\n🟣 ${title}\n`;

    sliders.forEach(slider => {
      const rating = slider.value;
      const label = slider.dataset.label;
      report += `  - ${label}: ${rating}/3\n`;
    });
  });

  report += `\n📝 Additional notes:\n${notes || '[No additional notes provided]'}\n`;

  document.getElementById('output').value = report.trim();
}

// Copies the report to clipboard
function copyReport() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy');
}

// Exports the report as a styled PDF with a logo header
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = new Image();
  logo.src = 'AU logo primary_white.png';

  logo.onload = () => {
    doc.setFillColor(22, 12, 80); // Header colour
    doc.rect(0, 0, 210, 30, 'F');
    doc.addImage(logo, 'PNG', 10, 5, 40, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Canvas UX Review Summary', 105, 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
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

    doc.save('Canvas-UX-Review.pdf');
  };
}
