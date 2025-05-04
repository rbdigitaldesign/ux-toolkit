const checklistItems = [
  {
    category: "✅ Make navigation visible and predictable",
    items: [
      "Avoid hiding core links in collapsible menus.",
      "Position core navigation consistently (e.g. left-side modules).",
      "Minimise clutter in global navigation."
    ]
  },
  {
    category: "🧠 Communicate where users are",
    items: [
      "Use clear H1/H2 headings and breadcrumbs.",
      "Highlight the current module/topic visually.",
      "Avoid jumping users to unexpected locations."
    ]
  },
  {
    category: "🧾 Use clear and scannable labels",
    items: [
      "Avoid internal jargon; use familiar terms.",
      "Be concise and front-load keywords.",
      "Standardise terminology across pages."
    ]
  },
  {
    category: "🎨 Support contrast and visibility",
    items: [
      "Ensure button and link colours meet WCAG standards.",
      "Use bold or headings for emphasis, not just colour.",
      "Limit pages to a single clear call-to-action."
    ]
  },
  {
    category: "📱 Design for interaction and accessibility",
    items: [
      "Use click-based reveals (not hover only).",
      "Avoid deeply nested navigation.",
      "Use large tap/click areas on mobile."
    ]
  },
  {
    category: "📌 Keep important navigation sticky",
    items: [
      "Use pinned headers or floating menus if possible."
    ]
  }
];

window.onload = () => {
  const container = document.getElementById('checklistContainer');
  checklistItems.forEach(section => {
    const box = document.createElement('div');
    box.className = 'checklist-box';
    const title = document.createElement('h3');
    title.textContent = section.category;
    box.appendChild(title);

    section.items.forEach(item => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.label = item;
      label.appendChild(checkbox);
      label.append(` ${item}`);
      box.appendChild(label);
    });

    container.appendChild(box);
  });
};

function generateReport() {
  const courseName = document.getElementById("courseName").value;
  const pageURL = document.getElementById("pageURL").value;
  const courseBuilder = document.getElementById("courseBuilder").value;
  const designerName = document.getElementById("designerName").value;
  const notes = document.getElementById("notes").value;

  const checkboxes = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
  const checked = [];
  const unchecked = [];

  checkboxes.forEach(cb => {
    (cb.checked ? checked : unchecked).push(cb.dataset.label);
  });

  let report = `Canvas UX Review Report\n\n`;
  report += `Course: ${courseName}\nPage URL: ${pageURL}\nCourse Builder: ${courseBuilder}\nReviewed by: ${designerName}\n\n`;

  report += `✅ Implemented:\n${checked.map(item => `- ${item}`).join('\n')}\n\n`;
  report += `⚠️ Recommended improvements:\n${unchecked.map(item => `- ${item}`).join('\n')}\n\n`;
  if (notes.trim()) {
    report += `📝 Additional notes:\n${notes.trim()}\n`;
  }

  document.getElementById("reportText").value = report;
}

function copyReport() {
  const textArea = document.getElementById("reportText");
  textArea.select();
  document.execCommand("copy");
  alert("Report copied to clipboard.");
}
