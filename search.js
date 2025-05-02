document.getElementById('searchInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const value = e.target.value.toLowerCase().trim();

    if (value.includes('jotform')) {
      window.location.href = 'tools.html#jotform';
    } else if (value.includes('card sorting')) {
      window.location.href = 'methodologies.html#card-sorting';
    } else if (value.includes('usability')) {
      window.location.href = 'methodologies.html#usability-testing';
    } else if (value.includes('tree testing')) {
      window.location.href = 'methodologies.html#tree-testing';
    } else if (value.includes('hotjar') || value.includes('heatmap')) {
      window.location.href = 'tools.html#hotjar';
    } else if (value.includes('accessibility')) {
      window.location.href = 'resources.html#accessibility';
    } else if (value.includes('template')) {
      window.location.href = 'resources.html#templates';
    } else if (value.includes('consent')) {
      window.location.href = 'resources.html#consent';
    } else if (value.includes('survey')) {
      window.location.href = 'tools.html#google-forms';
    } else {
      alert('Sorry, we couldn’t find a matching tool or method.');
    }
  }
});
