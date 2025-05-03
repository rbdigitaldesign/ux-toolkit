document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');
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

  // Show suggestions on input focus
  if (searchInput && searchSuggestions) {
    searchInput.addEventListener('focus', () => {
      filterSuggestions(searchInput.value);
      searchSuggestions.style.display = 'block';
    });

    searchInput.addEventListener('input', () => {
      filterSuggestions(searchInput.value);
      searchSuggestions.style.display = searchInput.value.trim() ? 'block' : 'none';
    });
  }

  function filterSuggestions(val) {
    const lowerVal = val.toLowerCase();
    document.querySelectorAll('#searchSuggestions li').forEach(item => {
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
  document.querySelectorAll('#searchSuggestions li').forEach(item => {
    item.classList.add('suggestion'); // ensure .suggestion class exists
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      searchSuggestions.style.display = 'none';
      handleSearch(item.textContent);
    });
  });

  // Submit form (search)
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearch(searchInput.value);
    });
  }
});
