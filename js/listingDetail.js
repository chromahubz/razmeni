// Listing Detail page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get('id');

  if (!listingId) {
    window.location.href = 'listings.html';
    return;
  }

  const listing = getListingById(listingId);

  if (!listing) {
    if (typeof Toast !== 'undefined') {
      Toast.error('Oglas nije pronađen');
    }
    setTimeout(() => {
      window.location.href = 'listings.html';
    }, 1500);
    return;
  }

  displayListingDetail(listing);
  displayUserCard(listing.user);
  displaySimilarListings(listing.id, listing.category);
});

function displayListingDetail(listing) {
  const container = document.getElementById('listing-detail');

  const deliveryInfo = [];
  if (listing.offersPickup) deliveryInfo.push('Lično preuzimanje');
  if (listing.offersDelivery) deliveryInfo.push(`Dostava (${listing.deliveryRadius || 0}km)`);

  container.innerHTML = `
    <img src="${listing.images[0]}" alt="${listing.title}" class="listing-detail-image">

    <div class="listing-detail-content">
      <div class="listing-detail-header">
        <div>
          <div class="badge badge-category">${listing.categoryIcon} ${listing.categoryName}</div>
          <h1 class="listing-detail-title">${listing.title}</h1>
          <div class="listing-detail-meta">
            <span>📍 ${listing.city}, ${listing.address}</span>
            <span>⏰ ${formatDate(listing.createdAt)}</span>
            <span>👁️ 142 pregleda</span>
          </div>
        </div>
        <div class="listing-detail-points">${listing.points}<br><span style="font-size: 14px; font-weight: 400; color: var(--gray-600);">poena</span></div>
      </div>

      <div class="listing-detail-desc">
        ${listing.description}
      </div>

      <div class="listing-detail-info">
        <div class="info-row">
          <span class="info-label">Količina</span>
          <span class="info-value">${listing.quantity} ${listing.unit}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Stanje</span>
          <span class="info-value">${listing.condition}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Preuzimanje</span>
          <span class="info-value">${deliveryInfo.join(', ')}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Lokacija</span>
          <span class="info-value">${listing.city}, ${listing.address}</span>
        </div>
      </div>

      <div class="listing-detail-actions">
        <button class="btn btn-primary btn-lg" style="flex: 1;">💱 Predloži razmenu</button>
        <button class="btn btn-secondary btn-lg" style="flex: 1;">💬 Kontaktiraj</button>
        <button class="btn btn-secondary">❤️</button>
      </div>

      <!-- Galerija slika -->
      ${listing.images.length > 1 ? `
        <div style="margin-top: 2rem;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 1rem;">Galerija</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
            ${listing.images.slice(1).map(img => `
              <img src="${img}" alt="Dodatna slika" style="width: 100%; height: 150px; object-fit: cover; border-radius: var(--radius); cursor: pointer;">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function displayUserCard(user) {
  const container = document.getElementById('user-card');

  container.innerHTML = `
    <div class="user-avatar"></div>
    <h3 class="user-name">${user.name}</h3>
    <p class="user-location">📍 Lokacija</p>

    <div class="user-stats">
      <div class="user-stat">
        <span class="user-stat-value">${user.trustScore}</span>
        <span class="user-stat-label">Trust Score</span>
      </div>
      <div class="user-stat">
        <span class="user-stat-value">${user.totalTrades}</span>
        <span class="user-stat-label">Razmena</span>
      </div>
      <div class="user-stat">
        <span class="user-stat-value">${user.totalRatings}</span>
        <span class="user-stat-label">Ocena</span>
      </div>
    </div>

    <button class="btn btn-primary" style="width: 100%;">Vidi profil</button>
    <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;">Ostali oglasi</button>

    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200); text-align: left;">
      <p style="font-size: 14px; color: var(--gray-600); margin-bottom: 0.5rem;">
        Član od ${new Date(user.memberSince).toLocaleDateString('sr-RS', { year: 'numeric', month: 'long' })}
      </p>
      <p style="font-size: 14px; color: var(--gray-600);">
        ⭐ Prosečna ocena: ${(user.trustScore / 20).toFixed(1)}/5
      </p>
    </div>
  `;
}

function displaySimilarListings(excludeId, category) {
  const container = document.getElementById('similar-listings');
  let similar = mockListings.filter(l => l.category === category && l.id !== parseInt(excludeId));

  if (similar.length === 0) {
    similar = getRandomListings(3, excludeId);
  } else {
    similar = similar.slice(0, 3);
  }

  container.innerHTML = similar.map(listing => createListingCard(listing)).join('');
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
