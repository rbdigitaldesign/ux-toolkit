// model unchanged…
const model = {
  "Clear": {
    description: "Assess clarity of structure and presentation.",
    checklist: [
      "Navigation is visible and predictable",
      "Headings and breadcrumbs indicate user location",
      "Language avoids internal jargon and is concise",
      "Buttons and links use consistent, visible styles"
    ]
  },
  "Contextual": {
    description: "Assess relevance and contextual fit.",
    checklist: [
      "Authentic examples are provided",
      "Resources align with discipline",
      "Cultural inclusivity is considered",
      "Supplementary materials are relevant"
    ]
  },
  "Interactive": {
    description: "Assess interactivity and engagement.",
    checklist: [
      "Embedded quizzes or questions are present",
      "Media elements support learning",
      "Feedback mechanisms are clear",
      "Collaborative activities are available"
    ]
  },
  "Challenging": {
    description: "Assess challenge level and critical thinking.",
    checklist: [
      "Tasks require higher-order thinking",
      "Scaffolded activities are provided",
      "Stretch tasks encourage deeper learning",
      "Reflection prompts are included"
    ]
  },
  "Personalised": {
    description: "Assess personalisation and support.",
    checklist: [
      "Learner choices are offered",
      "Adaptive pathways are indicated",
      "Instructor presence is clear",
      "Support links are available"
    ]
  }
};

// render all fieldsets with checklist and slider (using "developing" for 2)
window.onload = () => {
  const container = document.getElementById("descriptorContainer");
  Object.entries(model).forEach(([category, info]) => {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `
      <legend>${category}</legend>
      <p><em>${info.description}</em></p>
      ${info.checklist.map(item =>
        `<label><input type="checkbox" data-cat="${category}" data-item="${item}" /> ${item}</label>`
      ).join("")}
      <label style="margin-top:1em;">Overall score for '${category}'</label>
      <input type="range" min="0" max="3" value="0" class="slider" data-label="${category}" />
      <div class="range-labels">
        <span>0 = Fails</span>
        <span>1 = Meets</span>
        <span>2 = Developing</span>
        <span>3 = Exemplary</span>
      </div>
    `;
    container.appendChild(fs);
  });
};

// generate report + chart
function generateReport() {
  const first     = document.getElementById('reviewerFirstName').value.trim()    || '[First]';
  const last      = document.getElementById('reviewerLastName').value.trim()     || '[Last]';
  const position  = document.getElementById('positionDescription').value.trim() || '[Position]';
  const reviewer  = `${first} ${last}`;
  const builder   = document.getElementById('builderName').value.trim()         || '[Builder]';
  const course    = document.getElementById('courseName').value.trim()          || '[Course Name]';
  const url       = document.getElementById('pageUrl').value.trim()             || '[Page URL]';
  const comments  = document.getElementById('comments').value.trim()            || '[No comments]';

  const reportData = {};
  document.querySelectorAll('.slider').forEach(slider => {
    const cat = slider.dataset.label;
    reportData[cat] = reportData[cat] || { scores: [], selected: [] };
    reportData[cat].scores.push(+slider.value);
  });
  document.querySelectorAll('input[type=checkbox]').forEach(cb => {
    if (!cb.checked) return;
    const cat  = cb.dataset.cat;
    const item = cb.dataset.item;
    reportData[cat].selected.push(item);
  });

  let out = `Canvas UX Review Summary\n\nReviewer: ${reviewer}\n` +
            `Position: ${position}\n` +
            `Course Builder: ${builder}\nCourse: ${course}\nPage URL: ${url}\n\n` +
            `This report shows which checklist items were observed, plus category scores.\n`;

  const labels = [], scores = [];
  Object.entries(reportData).forEach(([cat, info]) => {
    const avg   = (info.scores.reduce((a,b)=>a+b,0)/info.scores.length).toFixed(2);
    const total = model[cat].checklist.length;
    const count = info.selected.length;

    out += `\n📘 ${cat} (Avg: ${avg}/3)\n`;
    out += `✔ Observed ${count} of ${total} items:\n`;
    if (count) {
      info.selected.forEach(i => out += `- ${i}\n`);
    } else {
      out += `- None selected\n`;
    }

    labels.push(cat);
    scores.push(+avg);
  });

  out += `\n📝 Comments:\n${comments}\n`;
  document.getElementById('output').value = out;
  renderChart(labels, scores);
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if(window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label:'Avg score', data:scores, backgroundColor:'#1448FF', borderRadius:5 }]
    },
    options: { responsive:true, scales:{ y:{ suggestedMin:0, suggestedMax:3, ticks:{ stepSize:1 } } } }
  });
}

function copyReport() {
  const t = document.getElementById('output');
  t.select();
  document.execCommand('copy');
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = document.getElementById('output').value.split('\n');
  let y = 15;

  doc.setFontSize(16).text('Canvas UX Review Summary', 105, y, { align:'center' });
  y += 10;
  doc.setFontSize(11);

  lines.forEach(line => {
    if (y > 280) { doc.addPage(); y = 10; }
    doc.text(line, 10, y);
    y += 7;
  });

  doc.save('Canvas-UX-Review.pdf');
}
