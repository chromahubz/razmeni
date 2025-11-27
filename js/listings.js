// Listings page JavaScript

let currentFilters = {
  search: '',
  category: '',
  city: '',
  sort: 'newest'
};

document.addEventListener('DOMContentLoaded', () => {
  // Učitaj filtere iz URL parametara
  const params = new URLSearchParams(window.location.search);
  if (params.get('category')) {
    currentFilters.category = params.get('category');
    document.getElementById('category-filter').value = params.get('category');
  }

  // Event listeneri za filtere
  document.getElementById('search').addEventListener('input', (e) => {
    currentFilters.search = e.target.value;
    applyFilters();
  });

  document.getElementById('category-filter').addEventListener('change', (e) => {
    currentFilters.category = e.target.value;
    applyFilters();
  });

  document.getElementById('city-filter').addEventListener('change', (e) => {
    currentFilters.city = e.target.value;
    applyFilters();
  });

  document.getElementById('sort-filter').addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    applyFilters();
  });

  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  document.getElementById('reset-from-empty').addEventListener('click', resetFilters);

  // Inicijalno učitavanje
  applyFilters();
});

function applyFilters() {
  const filtered = filterListings(currentFilters);
  displayListings(filtered);
}

function displayListings(listings) {
  const container = document.getElementById('listings-grid');
  const countElement = document.getElementById('count');
  const noResults = document.getElementById('no-results');

  countElement.textContent = listings.length;

  if (listings.length === 0) {
    container.style.display = 'none';
    noResults.style.display = 'block';
  } else {
    container.style.display = 'grid';
    noResults.style.display = 'none';
    container.innerHTML = listings.map(listing => createListingCard(listing)).join('');
  }
}

function createListingCard(listing) {
  return `
    <a href="listing-detail.html?id=${listing.id}" class="listing-card">
      <img src="${listing.images[0]}" alt="${listing.title}" class="listing-card-image">
      <div class="listing-card-content">
        <div class="badge badge-category">${listing.categoryIcon} ${listing.categoryName}</div>
        <h3 class="listing-card-title">${listing.title}</h3>
        <p class="listing-card-desc">${listing.description}</p>

        <div class="listing-card-footer">
          <div class="listing-card-points">${listing.points} poena</div>
          <div class="listing-card-location">📍 ${listing.city}</div>
        </div>

        <div class="listing-card-user">
          <div class="listing-card-avatar"></div>
          <div>
            <div class="listing-card-username">${listing.user.name}</div>
            <div class="trust-badge">⭐ ${listing.user.trustScore}</div>
          </div>
        </div>
      </div>
    </a>
  `;
}

function resetFilters() {
  currentFilters = {
    search: '',
    category: '',
    city: '',
    sort: 'newest'
  };

  document.getElementById('search').value = '';
  document.getElementById('category-filter').value = '';
  document.getElementById('city-filter').value = '';
  document.getElementById('sort-filter').value = 'newest';

  applyFilters();
}
