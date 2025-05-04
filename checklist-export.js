const checklistData = {
  "Make navigation visible and predictable": [
    "Avoid hiding core links in collapsible menus.",
    "Position core navigation consistently (e.g. left-side modules).",
    "Minimise clutter in global navigation."
  ],
  "Communicate where users are": [
    "Use clear H1/H2 headings and breadcrumbs.",
    "Highlight the current module/topic visually.",
    "Avoid jumping users to unexpected locations."
  ],
  "Use clear and scannable labels": [
    "Avoid internal jargon; use familiar terms.",
    "Be concise and front-load keywords.",
    "Standardise terminology across pages."
  ],
  "Support contrast and visibility": [
    "Ensure button and link colours meet WCAG standards.",
    "Use bold or headings for emphasis, not just colour.",
    "Limit pages to a single clear call-to-action."
  ],
  "Design for interaction and accessibility": [
    "Use click-based reveals (not hover only).",
    "Avoid deeply nested navigation.",
    "Use large tap/click areas on mobile."
  ],
  "Keep important navigation sticky": [
    "Use pinned headers or floating menus if possible."
  ]
};

window.onload = () => {
  const container = document.getElementById("checklistContainer");
  for (let section in checklistData) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = section;
    fieldset.appendChild(legend);

    checklistData[section].forEach((item, idx) => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.section = section;
      input.dataset.label = item;
      label.appendChild(input);
      label.append(` ${item}`);
      fieldset.appendChild(label);
    });

    container.appendChild(fieldset);
  }
};

function generateReport() {
  const course = document.getElementById("courseName").value;
  const url = document.getElementById("pageUrl").value;
  const builder = document.getElementById("builder").value;
  const designer = document.getElementById("designer").value;
  const notes = document.getElementById("notes").value;
  const checkboxes = document.querySelectorAll("input[type='checkbox']");

  let passed = [];
  let missing = [];

  checkboxes.forEach(cb => {
    const entry = `• ${cb.dataset.label} (${cb.dataset.section})`;
    if (cb.checked) {
      passed.push(entry);
    } else {
      missing.push(entry);
    }
  });

  const report = `Canvas UX Checklist Report

Course: ${course}
Page: ${url}
Course Builder: ${builder}
Designer: ${designer}

Summary:
This report was generated using the Canvas UX checklist. The purpose is to guide a conversation with the Course Builder about current strengths and potential areas of improvement on the page.

✅ Implemented items:
${passed.length ? passed.join("\n") : "None selected."}

⚠️ Areas to consider improving:
${missing.length ? missing.join("\n") : "None"}

💬 Additional suggestions:
${notes || "None"}

—

End of report.
`;

  document.getElementById("reportOutput").value = report;
}

function copyToClipboard() {
  const output = document.getElementById("reportOutput");
  output.select();
  document.execCommand("copy");
  alert("Report copied to clipboard!");
}
