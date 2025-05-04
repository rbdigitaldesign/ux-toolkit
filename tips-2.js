function generateReport() {
  const course = document.getElementById("courseName").value.trim();
  const url = document.getElementById("pageUrl").value.trim();
  const builder = document.getElementById("courseBuilder").value.trim();
  const designer = document.getElementById("designerName").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const checks = document.querySelectorAll('.checklist input[type="checkbox"]');
  const implemented = [];
  const missing = [];

  checks.forEach(c => {
    (c.checked ? implemented : missing).push(c.value);
  });

  const reportText = `
Canvas UX Design Checklist Summary

Course Name: ${course}
Page URL: ${url}
Course Builder: ${builder}
Designer: ${designer}

Purpose:
This report summarises the user experience (UX) design elements reviewed for the above Canvas course page. It highlights what is currently in place and what is recommended for improvement, to help guide future iterations and discussions.

✔️ Implemented Items:
${implemented.length ? implemented.map(i => `- ${i}`).join('\n') : 'None yet.'}

⚠️ Recommended Improvements:
${missing.length ? missing.map(i => `- ${i}`).join('\n') : 'All checked!'}

Additional Notes:
${notes || 'N/A'}

This checklist can be used as a starting point in discussions with the Course Builder or program team to uplift clarity, consistency, and accessibility within Canvas.
`;

  document.getElementById("output").value = reportText;
}

function copyReport() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("Report copied to clipboard!");
}

function exportPDF() {
  const text = document.getElementById("output").value;
  const blob = new Blob([text], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "UX-checklist-report.pdf";
  link.click();
}
