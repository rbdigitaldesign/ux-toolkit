document.getElementById('searchInput').addEventListener('input', function (e) {
  const value = e.target.value.toLowerCase().trim();
  if (value.includes('jotform')) {
    window.location.href = 'tools.html#jotform';
  } else if (value.includes('card sorting')) {
    window.location.href = 'methodologies.html#card-sorting';
  } else if (value.includes('usability')) {
    window.location.href = 'methodologies.html#usability-testing';
  } else if (value.includes('heatmap') || value.includes('hotjar')) {
    window.location.href = 'tools.html#hotjar';
  } else if (value.includes('template')) {
    window.location.href = 'resources.html#templates';
  }
});
