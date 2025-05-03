document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchBar');
  const suggestionsList = document.getElementById('suggestionsList');

  const suggestions = [
    'Accessibility checklist',
    'Heatmap testing',
    'Card sorting',
    'Canvas UX conventions',
    'Design system guidelines'
  ];

  searchInput.addEventListener('input', function () {
    const input = this.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';

    if (input === '') {
      suggestionsList.classList.add('hidden');
      return;
    }

    const filtered = suggestions.filter(item => item.toLowerCase().includes(input));
    if (filtered.length > 0) {
      filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.addEventListener('click', function () {
          searchInput.value = item;
          suggestionsList.classList.add('hidden');
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.classList.remove('hidden');
    } else {
      suggestionsList.classList.add('hidden');
    }
  });

  document.addEventListener('click', function (e) {
    if (!document.querySelector('.search-container').contains(e.target)) {
      suggestionsList.classList.add('hidden');
    }
  });

  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message!');
    this.reset();
  });
});
