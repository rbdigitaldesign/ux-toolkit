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
  else if (query.includes('use')) window.location.href = 'use-in-courses.html';
  else if (query.includes('personas')) window.location.href = 'personas.html';
  else if (query.includes('tips')) window.location.href = 'tips.html';
  else alert('No matching tool found.');
};

searchInput.addEventListener('focus', () => {
  searchSuggestions.style.display = 'block';
  filterSuggestions(searchInput.value);
});

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

searchBtn.addEventListener('click', () => {
  handleSearch(searchInput.value);
});

document.querySelectorAll('.email-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const user = btn.dataset.user;
    const domain = btn.dataset.domain;
    window.location.href = `mailto:${user}@${domain}`;
  });
});
