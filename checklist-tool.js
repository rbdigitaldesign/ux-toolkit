function generateReport() {
  const courseName = document.getElementById('courseName').value.trim();
  const courseUrl = document.getElementById('pageUrl').value.trim();

  const sliders = document.querySelectorAll('.slider');
  let report = `Canvas UX Review Tool Summary\n\n`;

  if (courseName) report += `📘 Course: ${courseName}\n`;
  if (courseUrl) report += `🔗 URL: ${courseUrl}\n`;

  report += `\nRatings:\n`;

  sliders.forEach(slider => {
    const label = slider.getAttribute('data-label');
    const value = parseInt(slider.value);
    let descriptor = '';

    switch (value) {
      case 0:
        descriptor = '❌ Needs significant improvement';
        break;
      case 1:
        descriptor = '⚠️ Baseline level met';
        break;
      case 2:
        descriptor = '✅ Good implementation';
        break;
      case 3:
        descriptor = '🌟 High-quality implementation';
        break;
    }

    report += `- ${label}: ${descriptor}\n`;
  });

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

  // Header
  const logo = new Image();
  logo.src = 'AU logo primary_white.png';

  logo.onload = () => {
    doc.setFillColor(22, 12, 80); // dark blue
    doc.rect(0, 0, 210, 30, 'F');
    doc.addImage(logo, 'PNG', 10, 5, 40, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Canvas UX Review Summary', 105, 20, { align: 'center' });

    // Body
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(document.getElementById('output').value, 180);
    let y = 40;
    lines.forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 7;
    });

    doc.save('canvas-ux-review.pdf');
  };
}
