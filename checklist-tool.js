// Course quality descriptors and their criteria
const criteria = {
  Clear: [
    "Accessible and inclusive to all students",
    "Easy to understand and navigate",
    "Has defined goals and expectations",
    "Utilises technology that doesn’t get in the way of learning",
    "Explains the requirements for interactions"
  ],
  Contextual: [
    "Articulates each activity with purpose and intention",
    "Contextualises learning in the real world",
    "Tests learning with varied and suitable assessments",
    "Delivers content that is contemporary and relevant"
  ],
  Interactive: [
    "Actively constructed learning",
    "Provides actionable feedback",
    "Promotes flexible communication",
    "Facilitates discussion and collaboration"
  ],
  Challenging: [
    "Promotes deeper learning",
    "Supports creation of new knowledge",
    "Has consistent teaching support"
  ],
  Personalised: [
    "Adds value to the student",
    "Respects student time",
    "Develops professional skills"
  ]
};

// Dynamically render sliders with scores 0–3
window.onload = () => {
  const container = document.getElementById('slidersContainer');
  Object.entries(criteria).forEach(([category, subs]) => {
    const block = document.createElement('div');
    block.className = 'slider-group';
    const title = document.createElement('h2');
    title.textContent = category;
    block.appendChild(title);

    subs.forEach(sub => {
      const label = document.createElement('div');
      label.className = 'slider-label';
      label.textContent = sub;

      const wrap = document.createElement('div');
      wrap.className = 'range-wrap';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 3;
      slider.value = 0;
      slider.step = 1;

      const value = document.createElement('span');
      value.textContent = '0';

      slider.addEventListener('input', () => {
        value.textContent = slider.value;
      });

      wrap.appendChild(slider);
      wrap.appendChild(value);

      block.appendChild(label);
      block.appendChild(wrap);
    });

    container.appendChild(block);
  });
};

// Generate report for text output
function generateReport() {
  const name = document.getElementById('designerName').value.trim();
  const course = document.getElementById('courseName').value.trim();
  const lines = [`Canvas Course UX Review by ${name || '[Designer]'} for "${course || '[Course]'}"`, ""];

  document.querySelectorAll('.slider-group').forEach(group => {
    const category = group.querySelector('h2').textContent;
    lines.push(`📘 ${category}`);
    const sliders = group.querySelectorAll('input[type="range"]');
    const labels = group.querySelectorAll('.slider-label');

    sliders.forEach((s, i) => {
      lines.push(`- ${labels[i].textContent}: Score ${s.value}/3`);
    });
    lines.push("");
  });

  document.getElementById('output').value = lines.join('\n');
}

// Copy text report
function copyReport() {
  const text = document.getElementById('output');
  text.select();
  document.execCommand('copy');
}

// Export PDF with report summary
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = document.getElementById('output').value;
  const lines = doc.splitTextToSize(text, 180);
  doc.setFontSize(11);
  doc.text(lines, 15, 20);
  doc.save("Koalify-Course-Report.pdf");
}
