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

// helper to style the filled portion of each slider
function updateSliderColor(slider) {
  const min = +slider.min;
  const max = +slider.max;
  const val = +slider.value;
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(
    to right,
    #1448FF 0%,
    #1448FF ${pct}%,
    #ddd ${pct}%,
    #ddd 100%
  )`;
}

// 2) Render all form sections on load and clear name placeholders
window.onload = () => {
  // clear first/last name placeholders
  const fn = document.getElementById('reviewerFirstName');
  const ln = document.getElementById('reviewerLastName');
  if (fn) fn.placeholder = '';
  if (ln) ln.placeholder = '';

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
    // initial fill
    updateSliderColor(slider);
    // update on input
    slider.addEventListener('input', () => updateSliderColor(slider));
    // clickable ticks
    fs.querySelectorAll('.ticks span').forEach(tick => {
      tick.addEventListener('click', () => {
        slider.value = tick.dataset.value;
        slider.dispatchEvent(new Event('input'));
      });
    });
  });
};

// 3) generateReport, renderChart, copyReport, downloadPDF, exportCSV remain unchanged
