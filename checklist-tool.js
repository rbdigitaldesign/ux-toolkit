// checklist-tool.js

// 1) Descriptor model with guidance & help URLs
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

// 2) Helpers to style the filled portion and hide underlying tick
function updateSliderColor(slider) {
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #1448FF 0%, #1448FF ${pct}%, #ddd ${pct}%, #ddd 100%)`;
}

function updateTicks(slider) {
  slider.closest('.slider-container')
    .querySelectorAll('.ticks span')
    .forEach(t => t.style.visibility = (t.dataset.value === slider.value ? 'hidden' : 'visible'));
}

// 3) Render all descriptor sections on page load
window.onload = () => {
  ['reviewerFirstName','reviewerLastName'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.placeholder = '';
  });
  const container = document.getElementById("descriptorContainer");
  container.innerHTML = "";
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
      <div class="slider-container">
        <input type="range" min="0" max="3" value="0" class="slider" data-label="${category}" />
        <div class="ticks">
          <span data-value="0"></span>
          <span data-value="1"></span>
          <span data-value="2"></span>
          <span data-value="3"></span>
        </div>
      </div>
      <div class="range-labels">
        <span>0 = fails baseline</span>
        <span>1 = meets baseline</span>
        <span>2 = developing</span>
        <span>3 = exemplary</span>
      </div>
    `;
    container.appendChild(fs);

    const slider = fs.querySelector('input[type="range"]');
    updateSliderColor(slider);
    updateTicks(slider);
    slider.addEventListener('input', () => {
      updateSliderColor(slider);
      updateTicks(slider);
    });
    fs.querySelectorAll('.ticks span').forEach(t => {
      t.addEventListener('click', () => {
        slider.value = t.dataset.value;
        slider.dispatchEvent(new Event('input'));
      });
    });
  });
};

// 4) Generate report, reveal sections, store data
function generateReport() {
  ['reportSummary','dashboard','chart','output'].forEach(id => {
    document.getElementById(id).style.display = 'block';
  });

  // meta
  const meta = {
    reviewer: `${document.getElementById('reviewerFirstName').value.trim() || '[First]'} ${document.getElementById('reviewerLastName').value.trim() || '[Last]'}`,
    position: document.getElementById('positionDescription').value.trim() || '[Position]',
    builder: document.getElementById('builderName').value.trim() || '[Builder]',
    course: document.getElementById('courseName').value.trim() || '[Course Name]',
    url: document.getElementById('pageUrl').value.trim() || '[Page URL]',
    comments: document.getElementById('comments').value.trim() || '[No comments]',
    strengths: document.getElementById('strengths').value.trim().split('\n').filter(l=>l),
    developments: document.getElementById('developments').value.trim().split('\n').filter(l=>l)
  };

  // collect scores & selections
  const reportData = {};
  document.querySelectorAll('.slider').forEach(s => {
    const cat = s.dataset.label;
    reportData[cat] = reportData[cat] || { scores: [], selected: [], avg: 0 };
    reportData[cat].scores.push(+s.value);
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if(cb.checked) reportData[cb.dataset.cat].selected.push(cb.dataset.item);
  });
  Object.values(reportData).forEach(i => i.avg = i.scores.reduce((a,b)=>a+b,0)/i.scores.length);

  window.lastReportMeta = meta;
  window.lastReportData = reportData;

  // executive summary
  const avgs = Object.values(reportData).map(i=>i.avg);
  const overall = (avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(2);
  const urgent = Object.entries(reportData)
    .sort((a,b)=>a[1].avg - b[1].avg)
    .slice(0,2)
    .map(([k,i])=>`${k} (${i.avg.toFixed(2)})`)
    .join(', ');
  document.getElementById('reportSummary').innerHTML = `
    <h4>Executive summary</h4>
    <p>Overall average score: <strong>${overall}/3</strong>. Most urgent areas: ${urgent}.</p>
  `;

  // dashboard
  const rows = Object.entries(reportData).map(([cat,info]) => {
    const avg = info.avg.toFixed(2) + '/3';
    const status = info.avg >= 2.5 ? 'green' : info.avg >= 1.5 ? 'yellow' : 'red';
    const alert  = info.avg <= 1 ? 'below baseline' : '';
    return `<tr>
      <td>${cat}</td>
      <td>${avg}</td>
      <td>${status}</td>
      <td>${alert}</td>
    </tr>`;
  }).join('');
  document.getElementById('dashboard').innerHTML = `
    <table class="dashboard-table">
      <thead><tr><th>Descriptor</th><th>Score</th><th>Status</th><th>Alert</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  // text report
  let out = `UX review summary\n\nThis report combines UX heuristics with pedagogical quality descriptors (Clear, Contextual, Interactive, Challenging, Personalised) to provide actionable insights. Scores on a 0–3 scale are backed by observed checklist evidence.\n\n`;
  out += `Reviewer: ${meta.reviewer}\nPosition: ${meta.position}\nCourse Builder: ${meta.builder}\nCourse: ${meta.course}\nPage URL: ${meta.url}\n\n`;
  Object.entries(reportData).forEach(([cat,info]) => {
    const total = model[cat].checklist.length;
    const count = info.selected.length;
    const others = model[cat].checklist.filter(i=>!info.selected.includes(i));
    out += `📘 ${cat} (Avg: ${info.avg.toFixed(2)}/3)\n✔ Observed ${count} of ${total} items:\n`;
    if(count) info.selected.forEach(i=> out+=`- ${i}\n`);
    else out+=`- None selected\n`;
    out+=`\nℹ️ Other checklist items:\n`;
    others.forEach(i=> out+=`- ${i}\n`);
    out+=`\n`;
  });
  out += `💡 Key strengths:\n`; meta.strengths.forEach(s=> out+=`- ${s}\n`); if(!meta.strengths.length) out+=`- None provided\n`;
  out += `🔧 Areas for development:\n`; meta.developments.forEach(d=> out+=`- ${d}\n`); if(!meta.developments.length) out+=`- None provided\n`;
  out += `\n📝 Comments:\n${meta.comments}\n`;
  document.getElementById('output').value = out;

  renderChart(Object.keys(reportData), Object.values(reportData).map(i=>i.avg));
}

// 5) Render bar chart
function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if(window.uxChart) window.uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{ label:'Avg score', data:scores, backgroundColor:'#1448FF', borderRadius:5 }] },
    options:{ responsive:true, scales:{ y:{ suggestedMin:0, suggestedMax:3, ticks:{ stepSize:1 } } } }
  });
}

// 6) Copy report
function copyReport() {
  const t = document.getElementById('output');
  t.select();
  document.execCommand('copy');
}

// 7) Export PDF with table, chart and full report text
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const meta = window.lastReportMeta;
  const data = window.lastReportData;
  if(!meta||!data){ alert('Generate report first'); return; }

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // banner
  doc.setFillColor(22,12,81);
  doc.rect(0,0,pageW,25,'F');

  // logo
  const logo = new Image();
  logo.src = 'au-logo-placeholder.png';
  logo.onload = () => {
    const w = 40, h = (logo.height/logo.width)*w;
    doc.addImage(logo,'PNG',10,3,w,h);

    // title & timestamp
    doc.setTextColor(255,255,255).setFontSize(16)
       .text('UX review summary', pageW/2,15,{align:'center'});
    doc.setFontSize(9)
       .text(`Generated: ${new Date().toLocaleString()}`, pageW-10,20,{align:'right'});

    // framing paragraph
    doc.setTextColor(0,0,0).setFontSize(11);
    let y = 30;
    const framing = "This report combines UX heuristics with pedagogical quality descriptors (Clear, Contextual, Interactive, Challenging, Personalised) to provide actionable insights. Scores on a 0–3 scale are backed by observed checklist evidence.";
    doc.splitTextToSize(framing, pageW-28).forEach(line => {
      if(y > pageH-20){ doc.addPage(); y=20; }
      doc.text(line,14,y); y+=6;
    });
    y+=4;

    // metadata
    [ ['Reviewer', 'reviewer'], ['Position','position'], ['Course Builder','builder'], ['Course','course'], ['Page URL','url'] ]
      .forEach(([label,key]) => {
        if(y > pageH-20){ doc.addPage(); y=20; }
        doc.setFontSize(11).text(`${label}: ${meta[key]}`,14,y);
        y+=7;
      });
    y+=6;

    // dashboard table header
    doc.setFontSize(12).text('Dashboard',14,y); y+=6;
    doc.setFontSize(10);
    doc.text('Descriptor',14,y);
    doc.text('Score',80,y);
    doc.text('Status',110,y);
    doc.text('Alert',140,y);
    y+=5;

    // table rows
    Object.entries(data).forEach(([cat,info]) => {
      if(y > pageH-20){ doc.addPage(); y=20; }
      const avg    = info.avg.toFixed(2) + '/3';
      const status = info.avg >=2.5 ? 'green' : info.avg>=1.5 ? 'yellow' : 'red';
      const alert  = info.avg<=1 ? 'below baseline' : '';
      doc.text(cat,14,y);
      doc.text(avg,80,y);
      doc.text(status,110,y);
      doc.text(alert,140,y);
      y+=6;
    });
    y+=8;

    // chart image
    const chartCanvas = document.getElementById('chart');
    const chartImg = chartCanvas.toDataURL('image/png');
    const chartW = pageW-28;
    const chartH = chartW * 0.4;
    if(y + chartH > pageH-20){ doc.addPage(); y=20; }
    doc.addImage(chartImg,'PNG',14,y,chartW,chartH);
    y+=chartH+10;

    // full text report
    const reportText = document.getElementById('output').value;
    doc.setFontSize(10);
    doc.splitTextToSize(reportText, pageW-28).forEach(line => {
      if(y > pageH-20){ doc.addPage(); y=20; }
      doc.text(line,14,y);
      y+=5;
    });

    // footer
    doc.setFontSize(9).text('© 2025 TUX', pageW/2, pageH-10, {align:'center'});

    doc.save('UX-Review-Summary.pdf');
  };
}

// 8) Export CSV
function exportCSV() {
  const data = window.lastReportData;
  if(!data) return alert('Generate report first');
  const rows = ['Descriptor,Item,Selected,Score'];
  Object.entries(data).forEach(([cat,info]) => {
    const score = info.avg.toFixed(2);
    model[cat].checklist.forEach(item => {
      const sel = info.selected.includes(item) ? '1' : '0';
      rows.push(`"${cat}","${item}",${sel},${score}`);
    });
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'UX-Review-Summary.csv'; a.click();
}
