// checklist-tool.js

// descriptor model with plural-style guidance & help URLs
const model = {
  "Clear": {
    description: "Ensures learners can quickly understand where they are and what to do next. Uses consistent headings, logical flow, and clear labels so users never feel lost when navigating the page.",
    helpUrl: "https://canvas.adelaide.edu.au/guides/clear",
    checklist: [
      "Navigation is visible and predictable",
      "Headings and breadcrumbs indicate user location",
      "Language avoids internal jargon and is concise",
      "Buttons and links use consistent, visible styles"
    ]
  },
  "Contextual": {
    description: "Makes every element meaningful to the course objectives and student backgrounds. Provides examples, resources, and terminology that align with your discipline and the learners’ needs.",
    helpUrl: "https://canvas.adelaide.edu.au/guides/contextual",
    checklist: [
      "Authentic examples are provided",
      "Resources align with discipline",
      "Cultural inclusivity is considered",
      "Supplementary materials are relevant"
    ]
  },
  "Interactive": {
    description: "Engages learners actively by embedding opportunities for participation. Uses quizzes, discussions, or interactive media that require input and provide instant feedback.",
    helpUrl: "https://canvas.adelaide.edu.au/guides/interactive",
    checklist: [
      "Embedded quizzes or questions are present",
      "Media elements support learning",
      "Feedback mechanisms are clear",
      "Collaborative activities are available"
    ]
  },
  "Challenging": {
    description: "Promotes deeper learning through tasks that require critical thinking. Includes scaffolded exercises, stretch tasks, and reflection prompts to push learners beyond the basics.",
    helpUrl: "https://canvas.adelaide.edu.au/guides/challenging",
    checklist: [
      "Tasks require higher-order thinking",
      "Scaffolded activities are provided",
      "Stretch tasks encourage deeper learning",
      "Reflection prompts are included"
    ]
  },
  "Personalised": {
    description: "Supports diverse learner needs by offering choices and tailored guidance. Uses adaptive pathways, clear instructor presence, and direct links to help resources.",
    helpUrl: "https://canvas.adelaide.edu.au/guides/personalised",
    checklist: [
      "Learner choices are offered",
      "Adaptive pathways are indicated",
      "Instructor presence is clear",
      "Support links are available"
    ]
  }
};

// render the form sections
window.onload = () => {
  const container = document.getElementById("descriptorContainer");
  Object.entries(model).forEach(([category, info]) => {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `
      <legend>
        ${category}
        <a href="${info.helpUrl}" target="_blank" class="help-icon" title="Learn more about ${category}">?</a>
      </legend>
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
    container.appendChild(fs);
  });
};

function generateReport() {
  // unhide executive summary
  const summary = document.getElementById('reportSummary');
  summary.style.display = 'block';

  // gather meta
  const first    = document.getElementById('reviewerFirstName').value.trim()    || '[First]';
  const last     = document.getElementById('reviewerLastName').value.trim()     || '[Last]';
  const position = document.getElementById('positionDescription').value.trim() || '[Position]';
  const reviewer = `${first} ${last}`;
  const builder  = document.getElementById('builderName').value.trim()         || '[Builder]';
  const course   = document.getElementById('courseName').value.trim()          || '[Course Name]';
  const url      = document.getElementById('pageUrl').value.trim()             || '[Page URL]';
  const comments = document.getElementById('comments').value.trim()            || '[No comments]';

  // strengths & development
  const strengths    = document.getElementById('strengths').value.trim().split('\n').filter(l=>l);
  const developments = document.getElementById('developments').value.trim().split('\n').filter(l=>l);

  // collect scores & selections
  const reportData = {};
  document.querySelectorAll('.slider').forEach(slider => {
    const cat = slider.dataset.label;
    if (!reportData[cat]) reportData[cat] = { scores: [], selected: [], avg: 0 };
    reportData[cat].scores.push(+slider.value);
  });
  document.querySelectorAll('input[type=checkbox]').forEach(cb => {
    if (cb.checked) {
      const cat  = cb.dataset.cat;
      const item = cb.dataset.item;
      reportData[cat].selected.push(item);
    }
  });

  // compute avgs
  Object.entries(reportData).forEach(([cat, info]) => {
    info.avg = info.scores.reduce((a,b)=>a+b,0) / info.scores.length;
  });

  // executive summary
  const avgs = Object.values(reportData).map(i=>i.avg);
  const overallAvg = (avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(2);
  const urgent = Object.entries(reportData)
    .sort((a,b)=>a[1].avg - b[1].avg)
    .slice(0,2)
    .map(([k,i])=>`${k} (${i.avg.toFixed(2)})`);
  document.getElementById('reportSummary').innerHTML = `
    <h4>Executive summary</h4>
    <p>Overall average score: <strong>${overallAvg}/3</strong>. Most urgent areas: ${urgent.join(', ')}.</p>
  `;

  // dashboard
  const dashboard = document.getElementById('dashboard');
  let html = `<table class="dashboard-table"><thead>
    <tr><th>Descriptor</th><th>Score</th><th>Status</th><th>Alert</th></tr>
  </thead><tbody>`;
  Object.entries(reportData).forEach(([cat,info]) => {
    const avg = info.avg;
    const status = avg >= 2.5 ? '🟢' : avg >= 1.5 ? '🟡' : '🔴';
    const alert = avg <= 1 ? '⚠️ below baseline' : '';
    const cls = avg <= 1 ? 'low-score' : '';
    html += `<tr class="${cls}"><td>${cat}</td><td>${avg.toFixed(2)}/3</td>
      <td>${status}</td><td>${alert}</td></tr>`;
  });
  html += `</tbody></table>`;
  dashboard.innerHTML = html;

  // text report
  let out = `Canvas UX Review Summary\n\n`;
  out += `Reviewer: ${reviewer}\nPosition: ${position}\nCourse Builder: ${builder}\n`;
  out += `Course: ${course}\nPage URL: ${url}\n\nThis report shows observed checklist items, scores, strengths, and areas for development.\n`;
  Object.entries(reportData).forEach(([cat,info]) => {
    const total = model[cat].checklist.length;
    const count = info.selected.length;
    const others = model[cat].checklist.filter(i=>!info.selected.includes(i));
    out += `\n📘 ${cat} (Avg: ${info.avg.toFixed(2)}/3)\n`;
    out += `✔ Observed ${count} of ${total} items:\n`;
    info.selected.forEach(i=> out += `- ${i}\n`);
    if(count===0) out += `- None selected\n`;
    out += `\nℹ️ Other checklist items:\n`;
    others.forEach(i=> out += `- ${i}\n`);
  });
  out += `\n💡 Key strengths:\n`;
  strengths.forEach(s=> out += `- ${s}\n`) || out += `- None provided\n`;
  out += `\n🔧 Areas for development:\n`;
  developments.forEach(d=> out += `- ${d}\n`) || out += `- None provided\n`;
  out += `\n📝 Comments:\n${comments}\n`;
  document.getElementById('output').value = out;

  renderChart(Object.keys(reportData), Object.values(reportData).map(i=>i.avg));
  window.lastReportData = reportData;
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if(window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets:[{ label:'Avg score', data:scores, backgroundColor:'#1448FF', borderRadius:5 }] },
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
  let y=15;
  doc.setFontSize(16).text('Canvas UX Review Summary',105,y,{align:'center'});
  y+=10; doc.setFontSize(11);
  lines.forEach(line=>{
    if(y>280){doc.addPage();y=10;}
    doc.text(line,10,y); y+=7;
  });
  doc.save('Canvas-UX-Review.pdf');
}

function exportCSV() {
  const data = window.lastReportData;
  if(!data) return alert('Generate report first');
  const rows = ['Descriptor,Item,Selected,Score'];
  Object.entries(data).forEach(([cat,info])=>{
    const score = info.avg.toFixed(2);
    model[cat].checklist.forEach(item=>{
      const sel = info.selected.includes(item) ? '1' : '0';
      rows.push(`"${cat}","${item}",${sel},${score}`);
    });
  });
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'Canvas-UX-Review.csv';
  a.click();
}
