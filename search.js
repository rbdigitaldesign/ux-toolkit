const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');

const handleSearch = (value) => {
  const query = value.toLowerCase().trim();

  if (query.includes('jotform')) window.location.href = 'tools.html#jotform';
  else if (query.includes('card')) window.location.href = 'methodologies.html#card-sorting';
  else if (query.includes('usability')) window.location.href = 'methodologies.html#usability-testing';
  else if (query.includes('heatmap') || query.includes('hotjar')) window.location.href = 'tools.html#hotjar';
  else if (query.includes('accessibility')) window.location.href = 'resources.html#accessibility';
  else if (query.includes('media')) window.location.href = 'resources.html#media';
  else if (query.includes('use')) window.location.href = 'resources.html#use-in-courses';
  else if (query.includes('personas')) window.location.href = 'personas.html';
  else if (query.includes('tips')) window.location.href = 'tips.html';
  else alert('No matching tool found.');
};

// Show suggestions on input focus
searchInput.addEventListener('focus', () => {
  searchSuggestions.style.display = 'block';
  filterSuggestions(searchInput.value);
});

// Filter suggestions based on input
searchInput.addEventListener('input', () => {
  filterSuggestions(searchInput.value);
  searchSuggestions.style.display = 'block';
});

function filterSuggestions(val) {
  const lowerVal = val.toLowerCase();
  document.querySelectorAll('.suggestion').forEach(item => {
    const match = item.textContent.toLowerCase().includes(lowerVal);
    item.style.display = match ? 'block' : 'none';
  });
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!document.querySelector('.search-container').contains(e.target)) {
    searchSuggestions.style.display = 'none';
  }
});

// Handle suggestion click
document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', () => {
    searchInput.value = item.textContent;
    searchSuggestions.style.display = 'none';
    handleSearch(item.textContent);
  });
});

// Trigger search on button click
searchBtn.addEventListener('click', () => {
  handleSearch(searchInput.value);
});
