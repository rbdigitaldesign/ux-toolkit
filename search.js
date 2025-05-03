const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchSuggestions = document.getElementById('searchSuggestions');

const handleSearch = (value) => {
  const query = value.toLowerCase();
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

searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase();
  document.querySelectorAll('.suggestion').forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(val) ? 'block' : 'none';
  });
  searchSuggestions.style.display = val ? 'block' : 'none';
});

searchBtn.addEventListener('click', () => {
  handleSearch(searchInput.value);
});

document.addEventListener('click', (e) => {
  if (!document.querySelector('.search-container').contains(e.target)) {
    searchSuggestions.style.display = 'none';
  }
});

document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', () => {
    searchInput.value = item.textContent;
    searchSuggestions.style.display = 'none';
    handleSearch(item.textContent);
  });
});
