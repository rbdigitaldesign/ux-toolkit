const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const suggestionList = document.getElementById('searchSuggestions');

// Keyword routing logic
function handleSearch(value) {
  const query = value.toLowerCase().trim();

  if (query.includes('jotform')) {
    window.location.href = 'tools.html#jotform';
  } else if (query.includes('card sorting')) {
    window.location.href = 'methodologies.html#card-sorting';
  } else if (query.includes('usability')) {
    window.location.href = 'methodologies.html#usability-testing';
  } else if (query.includes('tree testing')) {
    window.location.href = 'methodologies.html#tree-testing';
  } else if (query.includes('hotjar') || query.includes('heatmap')) {
    window.location.href = 'tools.html#hotjar';
  } else if (query.includes('accessibility')) {
    window.location.href = 'resources.html#accessibility';
  } else if (query.includes('template')) {
    window.location.href = 'resources.html#templates';
  } else if (query.includes('consent')) {
    window.location.href = 'resources.html#consent';
  } else if (query.includes('survey') || query.includes('typeform') || query.includes('google forms')) {
    window.location.href = 'tools.html#google-forms';
  } else if (query.includes('media')) {
    window.location.href = 'resources.html#media';
  } else if (query.includes('use in courses')) {
    window.location.href = 'resources.html#use-in-courses';
  } else if (query.includes('personas')) {
    window.location.href = 'personas.html';
  } else if (query.includes('tips') || query.includes('testing tips')) {
    window.location.href = 'tips.html';
  } else {
    alert('Sorry, we couldn’t find a matching tool or method.');
  }
}

// Enter key triggers search
searchInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSearch(searchInput.value);
  }
});

// Form submit triggers search (via Search button)
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  handleSearch(searchInput.value);
});

// Show suggestions on input focus
searchInput.addEventListener('focus', () => {
  suggestionList.classList.add('visible');
});

// Filter visible suggestions as user types
searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase();
  const options = suggestionList.querySelectorAll('li');

  options.forEach(option => {
    const match = option.textContent.toLowerCase().includes(val);
    option.style.display = match ? 'block' : 'none';
  });
});

// Click on suggestion sets value and hides list
suggestionList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    searchInput.value = e.target.textContent;
    suggestionList.classList.remove('visible');
  }
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!searchForm.contains(e.target)) {
    suggestionList.classList.remove('visible');
  }
});
