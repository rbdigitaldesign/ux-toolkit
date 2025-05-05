// model stays unchanged
const model = {
  "Clear": { description: "...", checklist: [ /* ... */ ] },
  "Contextual": { description: "...", checklist: [ /* ... */ ] },
  "Interactive": { description: "...", checklist: [ /* ... */ ] },
  "Challenging": { description: "...", checklist: [ /* ... */ ] },
  "Personalised": { description: "...", checklist: [ /* ... */ ] }
};

// render logic unchanged
window.onload = () => {
  /* same as before */
};

function generateReport() {
  const reviewer = document.getElementById('reviewerName').value.trim() || '[Reviewer]';
  const builder  = document.getElementById('builderName').value.trim()  || '[Builder]';
  const course   = document.getElementById('courseName').value.trim()   || '[Course Name]';
  const url      = document.getElementById('pageUrl').value.trim()      || '[Page URL]';
  const comments = document.getElementById('comments').value.trim()     || '[No comments]';

  // gather slider scores and checked items
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
    reportData[cat].selected = reportData[cat].selected || [];
    reportData[cat].selected.push(item);
  });

  // build text output
  let out = `Canvas UX Review Summary\n\nReviewer: ${reviewer}\n` +
            `Course Builder: ${builder}\nCourse: ${course}\nPage URL: ${url}\n\n` +
            `This report shows which checklist items were observed, plus category scores.\n`;

  const labels = [], scores = [];

  Object.entries(reportData).forEach(([cat, info]) => {
    const avg = (info.scores.reduce((a,b)=>a+b,0)/info.scores.length).toFixed(2);
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
  // same as before
}

function copyReport() {
  // same as before
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const rpt = generateReport(); // ensure reportData is up-to-date
  const lines = document.getElementById('output').value.split('\n');

  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(16).text('Canvas UX Review Summary', 105, y, { align:'center' });
  y += 10;
  doc.setFontSize(11);
  lines.forEach(line => {
    if (y > 280) { doc.addPage(); y = 10; }
    doc.text(line, 10, y);
    y += 6;
  });

  doc.save('Canvas-UX-Review.pdf');
}
