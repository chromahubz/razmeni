// Unified Navbar Component
// Automatski renderuje navbar zavisno od login statusa

function renderNavbar() {
  const currentUser = dataManager.getCurrentUser();
  const navbar = document.querySelector('.navbar .navbar-content');

  if (!navbar) return;

  // Logo (uvek isti)
  const logo = `
    <a href="index.html" class="navbar-logo">Razmeni</a>
  `;

  // Links - zavisi od login statusa
  let links = '';
  if (currentUser) {
    // Get notification counts
    const unreadMessages = dataManager.getUnreadMessagesCount();
    const pendingTrades = dataManager.getPendingTradesCount();

    // Logged in user - prikaži sve linkove
    links = `
      <ul class="navbar-links">
        <li><a href="index.html">Početna</a></li>
        <li><a href="listings.html">Oglasi</a></li>
        <li><a href="smart-matches.html">Matchovi</a></li>
        <li><a href="favorites.html">Omiljeni</a></li>
        <li><a href="dashboard.html">Dashboard</a></li>
        <li><a href="trades.html" style="position: relative;">
          Razmene
          ${pendingTrades > 0 ? `<span class="badge">${pendingTrades}</span>` : ''}
        </a></li>
        <li><a href="calendar.html">Kalendar</a></li>
        <li><a href="achievements.html">Achievements</a></li>
        <li><a href="messages.html" style="position: relative;">
          Poruke
          ${unreadMessages > 0 ? `<span class="badge">${unreadMessages}</span>` : ''}
        </a></li>
      </ul>
    `;
  } else {
    // Not logged in - basic links
    links = `
      <ul class="navbar-links">
        <li><a href="index.html">Početna</a></li>
        <li><a href="listings.html">Oglasi</a></li>
        <li><a href="#kako">Kako funkcioniše</a></li>
      </ul>
    `;
  }

  // Actions - zavisi od login statusa
  let actions = '';
  if (currentUser) {
    actions = `
      <div class="navbar-actions">
        <a href="profile.html" style="font-size: 14px; color: var(--gray-700); margin-right: 1rem; text-decoration: none; font-weight: 500;">${currentUser.fullName}</a>
        <button class="btn btn-secondary" onclick="logout()">Odjavi se</button>
      </div>
    `;
  } else {
    actions = `
      <div class="navbar-actions">
        <a href="login.html" class="btn btn-secondary">Prijavi se</a>
        <a href="register.html" class="btn btn-primary">Registruj se</a>
      </div>
    `;
  }

  navbar.innerHTML = logo + links + actions;
}

// Logout funkcija dostupna globalno
function logout() {
  dataManager.logout();
  window.location.href = 'index.html';
}

// Set active class on current page link
function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.navbar-links a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.style.color = 'var(--primary)';
      link.style.fontWeight = '600';
    }
  });
}

// Auto-init navbar kada se DOM učita
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    setTimeout(setActiveLink, 100);
  });
} else {
  renderNavbar();
  setTimeout(setActiveLink, 100);
}
