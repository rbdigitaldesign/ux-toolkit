// define descriptors with checklist items and descriptions
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

// render all fieldsets on load
window.onload = () => {
  const container = document.getElementById("descriptorContainer");
  for (const [category, info] of Object.entries(model)) {
    const fs = document.createElement("fieldset");
    const lg = document.createElement("legend");
    lg.textContent = category;
    fs.appendChild(lg);

    const p = document.createElement("p");
    p.innerHTML = `<em>${info.description}</em>`;
    fs.appendChild(p);

    // checklist items
    info.checklist.forEach(item => {
      const lbl = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.setAttribute("data-cat", category);
      cb.setAttribute("data-label-sub", item);
      lbl.appendChild(cb);
      lbl.insertAdjacentText("beforeend", " " + item);
      fs.appendChild(lbl);
    });

    // slider
    const scoreLabel = document.createElement("label");
    scoreLabel.style.marginTop = "1em";
    scoreLabel.textContent = `Overall score for '${category}'`;
    const range = document.createElement("input");
    range.type = "range";
    range.min = "0";
    range.max = "3";
    range.value = "0";
    range.className = "slider";
    range.setAttribute("data-label", category);
    const markers = document.createElement("div");
    markers.className = "range-labels";
    markers.innerHTML = "<span>0 = Fails</span><span>1 = Meets</span><span>2 = Progress</span><span>3 = Exemplary</span>";

    fs.appendChild(scoreLabel);
    fs.appendChild(range);
    fs.appendChild(markers);

    container.appendChild(fs);
  }
};

function generateReport() {
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder = document.getElementById('builderName').value.trim() || '[Builder]';
  const course = document.getElementById('courseName').value.trim() || '[Course Name]';
  const url = document.getElementById('pageUrl').value.trim() || '[Page URL]';
  const comments = document.getElementById('comments').value.trim() || '[No additional comments]';

  // collect slider scores and checked items
  const sliders = document.querySelectorAll('.slider');
  const reportData = {};

  sliders.forEach(slider => {
    const cat = slider.getAttribute('data-label');
    if (!reportData[cat]) reportData[cat] = { scores: [], checked: [] };
    reportData[cat].scores.push(parseInt(slider.value));
  });

  // collect checked items
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.checked) {
      const cat = cb.getAttribute('data-cat');
      const item = cb.getAttribute('data-label-sub');
      reportData[cat].checked.push(item);
    }
  });

  // build output text
  let out = `Canvas UX Review Summary\n\n`;
  out += `Reviewer: ${reviewer}\nCourse Builder: ${builder}\nCourse: ${course}\nPage URL: ${url}\n\n`;
  out += `This report combines specific usability checks with reflective scoring on core course quality dimensions.\n`;

  const labels = [], scores = [];

  for (const [cat, info] of Object.entries(reportData)) {
    const avg = (info.scores.reduce((a,b) => a+b,0) / info.scores.length).toFixed(2);
    out += `\n📘 ${cat} (Average: ${avg}/3)\n`;
    labels.push(cat);
    scores.push(parseFloat(avg));
    if (info.checked.length) {
      out += `\n✔ Checklist items selected:\n`;
      info.checked.forEach(i => out += `- ${i}\n`);
      out += `\n📝 Note: unchecked items may still be present or not applicable.\n`;
    }
  }

  out += `\n📝 Reviewer Comments:\n${comments}\n`;
  document.getElementById('output').value = out;
  renderChart(labels, scores);
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels, datasets: [{
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

function copyReport() {
  const t = document.getElementById('output');
  t.select();
  document.execCommand('copy');
}
