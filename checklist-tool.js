function generateReport() {
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder = document.getElementById('builderName').value.trim() || '[Builder]';
  const course = document.getElementById('courseName').value.trim() || '[Course Name]';
  const url = document.getElementById('pageUrl').value.trim() || '[Page URL]';
  const comments = document.getElementById('comments').value.trim() || '[No additional comments]';

  const sliders = document.querySelectorAll('.slider');
  const grouped = {};

  sliders.forEach(slider => {
    const fieldset = slider.closest('fieldset');
    const category = fieldset.querySelector('legend').innerText.trim();
    const label = slider.getAttribute('data-label');
    const score = parseInt(slider.value);

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ label, score });
  });

  let output = `Canvas UX Review Summary\n\n`;
  output += `Reviewer: ${reviewer}\nCourse Builder: ${builder}\nCourse: ${course}\nURL: ${url}\n`;

  const labels = [];
  const scores = [];

  Object.entries(grouped).forEach(([category, items]) => {
    const avg = (items.reduce((sum, i) => sum + i.score, 0) / items.length).toFixed(2);
    output += `\n📘 ${category} (Avg: ${avg})\n`;
    labels.push(category);
    scores.push(parseFloat(avg));
    items.forEach(i => {
      output += `- ${i.label}: ${i.score}/3\n`;
    });
  });

  output += `\n📝 Reviewer Comments:\n${comments}\n`;

  document.getElementById('output').value = output;

  renderChart(labels, scores);
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.uxChart) window.uxChart.destroy(); // Prevent duplicates
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Avg Score',
        data: scores,
        backgroundColor: '#1448FF',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 3
        }
      }
    }
  });
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
    doc.setFontSize(14);
    doc.text('Canvas UX Review Summary', 105, 20, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    const text = document.getElementById('output').value;
    const lines = doc.splitTextToSize(text, 180);
    doc.setFontSize(10);
    doc.text(lines, 15, 40);

    doc.save('UX-checklist-report.pdf');
  };
}
