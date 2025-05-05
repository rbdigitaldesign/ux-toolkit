// checklist-tool.js

// updated descriptor model with richer, plural-style guidance
const model = {
  "Clear": {
    description: "Ensures learners can quickly understand where they are and what to do next. Uses consistent headings, logical flow, and clear labels so users never feel lost when navigating the page.",
    checklist: [
      "Navigation is visible and predictable",
      "Headings and breadcrumbs indicate user location",
      "Language avoids internal jargon and is concise",
      "Buttons and links use consistent, visible styles"
    ]
  },
  "Contextual": {
    description: "Makes every element meaningful to the course objectives and student backgrounds. Provides examples, resources, and terminology that align with your discipline and the learners’ needs.",
    checklist: [
      "Authentic examples are provided",
      "Resources align with discipline",
      "Cultural inclusivity is considered",
      "Supplementary materials are relevant"
    ]
  },
  "Interactive": {
    description: "Engages learners actively by embedding opportunities for participation. Uses quizzes, discussions, or interactive media that require input and provide instant feedback.",
    checklist: [
      "Embedded quizzes or questions are present",
      "Media elements support learning",
      "Feedback mechanisms are clear",
      "Collaborative activities are available"
    ]
  },
  "Challenging": {
    description: "Promotes deeper learning through tasks that require critical thinking. Includes scaffolded exercises, stretch tasks, and reflection prompts to push learners beyond the basics.",
    checklist: [
      "Tasks require higher-order thinking",
      "Scaffolded activities are provided",
      "Stretch tasks encourage deeper learning",
      "Reflection prompts are included"
    ]
  },
  "Personalised": {
    description: "Supports diverse learner needs by offering choices and tailored guidance. Uses adaptive pathways, clear instructor presence, and direct links to help resources.",
    checklist: [
      "Learner choices are offered",
      "Adaptive pathways are indicated",
      "Instructor presence is clear",
      "Support links are available"
    ]
  }
};

// render all fieldsets with checklist and slider
window.onload = () => {
  const container = document.getElementById("descriptorContainer");
  Object.entries(model).forEach(([category, info]) => {
    const fieldset = document.createElement("fieldset");
    fieldset.innerHTML = `
      <legend>${category}</legend>
      <p><em>${info.description}</em></p>
      ${info.checklist.map(item =>
        `<label><input type="checkbox" data-cat="${category}" data-item="${item}" /> ${item}</label>`
      ).join("")}
      <label style="margin-top:1em;">Overall score for '${category}'</label>
      <input type="range" min="0" max="3" value="0" class="slider" data-label="${category}" />
      <div class="range-labels">
        <span>0 = fails baseline</span>
        <span>1 = meets baseline</span>
        <span>2 = developing</span>
        <span>3 = exemplary</span>
      </div>
    `;
    container.appendChild(fieldset);
  });
};

// generate the text report and render chart
function generateReport() {
  // gather reviewer info
  const first = document.getElementById('reviewerFirstName').value.trim() || '[First]';
  const last = document.getElementById('reviewerLastName').value.trim() || '[Last]';
  const position = document.getElementById('positionDescription').value.trim() || '[Position]';
  const reviewer = `${first} ${last}`;
  const builder = document.getElementById('builderName').value.trim() || '[Builder]';
  const course = document.getElementById('courseName').value.trim() || '[Course Name]';
  const url = document.getElementById('pageUrl').value.trim() || '[Page URL]';
  const comments = document.getElementById('comments').value.trim() || '[No comments]';

  // collect scores and selections
  const reportData = {};
  document.querySelectorAll('.slider').forEach(slider => {
    const cat = slider.dataset.label;
    if (!reportData[cat]) reportData[cat] = { scores: [], selected: [] };
    reportData[cat].scores.push(+slider.value);
  });
  document.querySelectorAll('input[type=checkbox]').forEach(cb => {
    if (!cb.checked) return;
    const cat = cb.dataset.cat;
    const item = cb.dataset.item;
    reportData[cat].selected.push(item);
  });

  // build report text
  let output = `Canvas UX Review Summary\n\n`;
  output += `Reviewer: ${reviewer}\n`;
  output += `Position: ${position}\n`;
  output += `Course Builder: ${builder}\n`;
  output += `Course: ${course}\n`;
  output += `Page URL: ${url}\n\n`;
  output += `This report shows which checklist items were observed, which were not, and each category score.\n`;

  const labels = [], scores = [];
  Object.entries(reportData).forEach(([cat, info]) => {
    const avg = (info.scores.reduce((a, b) => a + b, 0) / info.scores.length).toFixed(2);
    const total = model[cat].checklist.length;
    const count = info.selected.length;
    const others = model[cat].checklist.filter(item => !info.selected.includes(item));

    output += `\n📘 ${cat} (Avg: ${avg}/3)\n`;
    labels.push(cat);
    scores.push(+avg);

    // observed items
    output += `\n✔ Observed ${count} of ${total} items:\n`;
    if (count > 0) {
      info.selected.forEach(i => output += `- ${i}\n`);
    } else {
      output += `- None selected\n`;
    }

    // other items
    output += `\nℹ️ Other checklist items (confirm applicability):\n`;
    others.forEach(i => output += `- ${i}\n`);
  });

  output += `\n📝 Comments:\n${comments}\n`;
  document.getElementById('output').value = output;

  renderChart(labels, scores);
}

// render bar chart using Chart.js
function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Avg score',
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

// copy report text to clipboard
function copyReport() {
  const textarea = document.getElementById('output');
  textarea.select();
  document.execCommand('copy');
}

// export report as styled PDF via jsPDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = document.getElementById('output').value.split('\n');
  let y = 15;

  doc.setFontSize(16).text('Canvas UX Review Summary', 105, y, { align: 'center' });
  y += 10;
  doc.setFontSize(11);

  lines.forEach(line => {
    if (y > 280) { doc.addPage(); y = 10; }
    doc.text(line, 10, y);
    y += 7;
  });

  doc.save('Canvas-UX-Review.pdf');
}
