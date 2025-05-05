// model: descriptors with checklists
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

// render all sections
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
        <span>0 = Fails</span><span>1 = Meets</span>
        <span>2 = Progress</span><span>3 = Exemplary</span>
      </div>
    `;
    container.appendChild(fs);
  });
};

function generateReport() {
  // meta
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder  = document.getElementById('builderName').value.trim()  || '[Builder]';
  const course   = document.getElementById('courseName').value.trim()   || '[Course Name]';
  const url      = document.getElementById('pageUrl').value.trim()      || '[Page URL]';
  const comments = document.getElementById('comments').value.trim()     || '[No comments]';

  // gather data
  const reportData = {};
  document.querySelectorAll('.slider').forEach(slider => {
    const cat = slider.dataset.label;
    reportData[cat] = reportData[cat] || { scores: [], checked: [] };
    reportData[cat].scores.push(+slider.value);
  });
  document.querySelectorAll('input[type=checkbox]').forEach(cb => {
    const cat  = cb.dataset.cat;
    const item = cb.dataset.item;
    reportData[cat].checked = reportData[cat].checked || [];
    if(cb.checked) reportData[cat].checked.push(item);
  });

  // compute unchecked
  Object.entries(reportData).forEach(([cat, info]) => {
    info.unchecked = model[cat].checklist.filter(item => !info.checked.includes(item));
  });

  // store globally for PDF
  window.lastReport = { reviewer, builder, course, url, comments, reportData };

  // build text output
  let out = `Canvas UX Review Summary\n\nReviewer: ${reviewer}\nCourse Builder: ${builder}\n` +
            `Course: ${course}\nPage URL: ${url}\n\nThis report combines checklist evidence with scoring.\n`;

  const labels = [], scores = [];
  Object.entries(reportData).forEach(([cat, info]) => {
    const avg = (info.scores.reduce((a,b)=>a+b,0)/info.scores.length).toFixed(2);
    out += `\n📘 ${cat} (Avg: ${avg}/3)\n`;
    labels.push(cat); scores.push(+avg);

    if(info.checked.length) {
      out += `\n✔ selected:\n` + info.checked.map(i=>`- ${i}\n`).join("");
    }
    if(info.unchecked.length) {
      out += `\n✖ not selected:\n` + info.unchecked.map(i=>`- ${i}\n`).join("");
    }
    out += `\n`;
  });

  out += `\n📝 Comments:\n${comments}\n`;
  document.getElementById('output').value = out;
  renderChart(labels, scores);
}

function renderChart(labels, scores) {
  const ctx = document.getElementById('chart').getContext('2d');
  if(window.uxChart) uxChart.destroy();
  window.uxChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label:'Avg score', data:scores, backgroundColor:'#1448FF', borderRadius:5 }] },
    options: { responsive:true, scales:{ y:{ suggestedMin:0, suggestedMax:3, ticks:{stepSize:1} } } }
  });
}

function copyReport() {
  const t = document.getElementById('output');
  t.select();
  document.execCommand('copy');
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const rpt = window.lastReport;
  if(!rpt) return alert('Generate report first.');

  const doc = new jsPDF();
  let y = 15;
  doc.setFontSize(18).setFont('helvetica','bold')
     .text('Canvas UX Review Summary', 105, y, { align:'center' });
  y += 10;
  doc.setFontSize(12).setFont('helvetica','normal');
  [`Reviewer: ${rpt.reviewer}`,'Course Builder: '+rpt.builder,'Course: '+rpt.course,'Page URL: '+rpt.url,'']
    .forEach(line=>{
      doc.text(line, 10, y);
      y+=7; if(y>280){ doc.addPage(); y=10; }
    });

  Object.entries(rpt.reportData).forEach(([cat,info])=>{
    const avg = (info.scores.reduce((a,b)=>a+b,0)/info.scores.length).toFixed(2);
    doc.setFont('helvetica','bold').text(`${cat} (Avg: ${avg}/3)`, 10, y);
    y+=7;
    doc.setFont('helvetica','normal');
    ['checked','unchecked'].forEach(type=>{
      const arr = info[type];
      if(arr.length){
        doc.text(type==='checked'?'✔ selected:':'✖ not selected:', 12, y);
        y+=7;
        arr.forEach(item=>{
          const lines = doc.splitTextToSize('- '+item, 180);
          lines.forEach(ln=>{
            doc.text(ln, 15, y);
            y+=7; if(y>280){ doc.addPage(); y=10; }
          });
        });
      }
    });
    y+=5; if(y>280){ doc.addPage(); y=10; }
  });

  doc.setFont('helvetica','bold').text('📝 Comments:',10,y); y+=7;
  doc.setFont('helvetica','normal');
  doc.splitTextToSize(rpt.comments,180).forEach(ln=>{
    doc.text(ln,10,y);
    y+=7; if(y>280){ doc.addPage(); y=10; }
  });

  doc.save('Canvas-UX-Review.pdf');
}
