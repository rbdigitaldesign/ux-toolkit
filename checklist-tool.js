function generateReport() {
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder = document.getElementById('builderName').value.trim() || '[Builder]';
  const course = document.getElementById('courseName').value.trim() || '[Course Name]';
  const url = document.getElementById('pageUrl').value.trim() || '[Page URL]';
  const comments = document.getElementById('comments').value.trim() || '[No additional comments]';

  const sliders = document.querySelectorAll('.slider');
  const grouped = {};

  sliders.forEach(slider => {
    const category = slider.getAttribute('data-label');
    const score = parseInt(slider.value);

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(score);
  });

  let output = `Canvas UX Review Summary\n\n`;
  output += `Reviewer: ${reviewer}\nCourse Builder: ${builder}\nCourse: ${course}\nPage URL: ${url}\n\n`;
  output += `This review combines specific usability checks with reflective scoring on core course quality dimensions.\n`;

  const labels = [], scores = [];

  Object.entries(grouped).forEach(([category, scoreList]) => {
    const avg = (scoreList.reduce((sum, s) => sum + s, 0) / scoreList.length).toFixed(2);
    output += `\n📘 ${category} Score: ${avg}/3\n`;
    labels.push(category);
    scores.push(parseFloat(avg));
  });

  output += `\n📝 Reviewer Comments:\n${comments}\n`;
  document.getElementById('output').value = output;

  renderChart(labels, scores);
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.uxChart) window.uxChart.destroy();
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
          suggestedMax: 3,
          ticks: { stepSize: 1 }
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
