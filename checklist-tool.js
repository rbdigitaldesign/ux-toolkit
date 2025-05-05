const descriptors = {
  "Clear": [
    "Accessibility and inclusion",
    "Navigation and clarity",
    "Goals and expectations",
    "Technology use",
    "Interaction guidance"
  ],
  "Contextual": [
    "Authentic examples",
    "Relevant resources",
    "Discipline alignment",
    "Cultural inclusivity"
  ],
  "Interactive": [
    "Embedded activities",
    "Media and visuals",
    "Feedback loops",
    "Collaborative opportunities"
  ],
  "Challenging": [
    "Higher-order thinking",
    "Scaffolded difficulty",
    "Stretch tasks",
    "Stimulating prompts"
  ],
  "Personalised": [
    "Adaptive pathways",
    "Choice and flexibility",
    "Instructor presence",
    "Support links"
  ]
};

window.onload = () => {
  const container = document.getElementById("descriptorContainer");
  for (const [title, items] of Object.entries(descriptors)) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = title;
    fieldset.appendChild(legend);

    items.forEach(item => {
      const label = document.createElement("label");
      label.textContent = item;

      const range = document.createElement("input");
      range.type = "range";
      range.min = 0;
      range.max = 3;
      range.value = 0;
      range.className = "slider";
      range.setAttribute("data-label", item);

      const markerRow = document.createElement("div");
      markerRow.className = "range-labels";
      markerRow.innerHTML = "<span>0 = Fails</span><span>1 = Meets</span><span>2 = Progress</span><span>3 = Exemplary</span>";

      fieldset.appendChild(label);
      fieldset.appendChild(range);
      fieldset.appendChild(markerRow);
    });

    container.appendChild(fieldset);
  }
};

function generateReport() {
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder = document.getElementById('builderName').value.trim() || '[Builder]';
  const course = document.getElementById('courseName').value.trim() || '[Course Name]';
  const url = document.getElementById('pageUrl').value.trim() || '[Page URL]';
  const comments = document.getElementById('comments').value.trim() || '[No additional comments]';

  const sliders = document.querySelectorAll('.slider');
  const grouped = {};

  sliders.forEach(slider => {
    const category = slider.closest('fieldset').querySelector('legend').innerText.trim();
    const label = slider.getAttribute('data-label');
    const score = parseInt(slider.value);

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ label, score });
  });

  let output = `Canvas UX Review Summary\n\n`;
  output += `Reviewer: ${reviewer}\nCourse Builder: ${builder}\nCourse: ${course}\nPage URL: ${url}\n\n`;
  output += `This report evaluates the user experience and pedagogical quality of a Canvas course page. Ratings are based on five quality descriptors: Clear, Contextual, Interactive, Challenging, and Personalised. Each category includes multiple sub-criteria scored on a scale from 0 (Fails baseline) to 3 (Exemplary practice).\n`;

  const labels = [], scores = [];

  Object.entries(grouped).forEach(([category, items]) => {
    const avg = (items.reduce((sum, i) => sum + i.score, 0) / items.length).toFixed(2);
    output += `\n📘 ${category} (Average Score: ${avg})\n`;
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
  if (window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Score',
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
          ticks: {
            stepSize: 1
          }
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

function downloadWord() {
  const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel } = window.docx;
  const outputText = document.getElementById('output').value;
  const lines = outputText.split('\n');

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: "Canvas UX Review Summary", heading: HeadingLevel.HEADING_1 }),
        ...lines.slice(1, 5).map(line => new Paragraph(line)),
        new Paragraph(""),
        new Paragraph({ text: "Score Summary", heading: HeadingLevel.HEADING_2 }),
        new Table({
          rows: lines.filter(l => l.startsWith("📘")).map(line => {
            const [category, avg] = line.replace("📘", "").split("(Average Score:");
            return new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(category.trim())] }),
                new TableCell({ children: [new Paragraph(avg.replace(")", "").trim())] })
              ]
            });
          })
        }),
        new Paragraph(""),
        new Paragraph({ text: "Reviewer Comments", heading: HeadingLevel.HEADING_2 }),
        new Paragraph(lines[lines.length - 1])
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Canvas-UX-Review.docx";
    a.click();
  });
}
