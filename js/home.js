// Home page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  loadPopularListings();
});

function loadPopularListings() {
  const container = document.getElementById('popular-listings');
  const popular = getRandomListings(6);

  container.innerHTML = popular.map(listing => createListingCard(listing)).join('');
}

function createListingCard(listing) {
  const imageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : 'https://via.placeholder.com/400x300/667eea/ffffff?text=Razmeni';

  return `
    <a href="listing-detail.html?id=${listing.id}" class="listing-card">
      <img src="${imageUrl}" alt="${listing.title}" class="listing-card-image">
      <div class="listing-card-content">
        <div class="badge badge-category">${listing.categoryName}</div>
        <h3 class="listing-card-title">${listing.title}</h3>
        <p class="listing-card-desc">${listing.description}</p>

        <div class="listing-card-footer">
          <div class="listing-card-points">${listing.points} poena</div>
          <div class="listing-card-location">${listing.city}</div>
        </div>

        <div class="listing-card-user">
          <div class="listing-card-avatar"></div>
          <div>
            <div class="listing-card-username">${listing.user.name}</div>
            <div class="trust-badge">Trust: ${listing.user.trustScore}</div>
          </div>
        </div>
      </div>
    </a>
  `;
}
