document.getElementById("exportBtn").addEventListener("click", function () {
  const form = document.getElementById("uxChecklistForm");
  const formData = new FormData(form);

  const course = formData.get("courseName");
  const url = formData.get("pageURL");
  const builder = formData.get("courseBuilder");
  const notes = formData.get("notes");
  const checkedItems = formData.getAll("items");

  const report = `
=== Canvas UX Checklist Report ===

Course: ${course}
Page URL: ${url}
Course Builder: ${builder}

Checklist:
${checkedItems.map(item => `✓ ${item}`).join("\n")}

Notes:
${notes || '—'}
`;

  document.getElementById("output").textContent = report;
});
