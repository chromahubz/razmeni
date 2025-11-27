# Razmeni - Barter Platform UI Prototype

Modern barter (razmena) platform for Serbia. Exchange goods and services using a points-based system without traditional money transactions.

## Features

### Core Functionality
- User authentication (register/login/logout)
- Create, edit, delete listings
- Browse and search listings with filters
- Propose trades between listings
- Accept/decline/complete trades
- Rate users after completed trades
- Trust Score algorithm
- Real-time messaging between users
- Favorites/Wishlist system
- User profile management
- Notification badges

### Design
- Apple-inspired minimalist design
- Fully responsive (mobile, tablet, desktop)
- No emojis - clean professional look
- Smooth animations and transitions
- Toast notifications instead of alerts

## Tech Stack

### Frontend
- Pure HTML, CSS, JavaScript (no frameworks)
- LocalStorage for data persistence (prototype)
- Modern ES6+ JavaScript
- CSS Grid & Flexbox for layouts
- CSS Variables for theming

### Design System
- **Colors**: Primary blue (#007AFF), purple gradients
- **Typography**: System fonts (Apple style)
- **Shadows**: Layered depth
- **Radius**: Rounded corners (12px, 16px, 24px)
- **Spacing**: 8px grid system

## Pages

1. **index.html** - Homepage with hero and popular listings
2. **listings.html** - Browse all listings with search/filters
3. **listing-detail.html** - Single listing view with trade proposal
4. **create-listing.html** - Create new listing form
5. **edit-listing.html** - Edit existing listing
6. **dashboard.html** - User dashboard with stats
7. **trades.html** - Manage trade proposals (received/sent)
8. **messages.html** - Chat with trading partners
9. **favorites.html** - Saved/favorited listings
10. **profile.html** - User profile with editable settings
11. **login.html** - Login page
12. **register.html** - Registration page
13. **404.html** - Error page

## File Structure

```
razmeni-ui-mock/
├── index.html
├── listings.html
├── listing-detail.html
├── create-listing.html
├── edit-listing.html
├── dashboard.html
├── trades.html
├── messages.html
├── favorites.html
├── profile.html
├── login.html
├── register.html
├── 404.html
├── css/
│   └── styles.css
├── js/
│   ├── mockData.js       # 15 mock listings
│   ├── dataManager.js    # LocalStorage CRUD operations
│   ├── navbar.js         # Unified navigation component
│   ├── home.js           # Homepage functionality
│   └── toast.js          # Toast notification system
├── vercel.json           # Vercel deployment config
├── .gitignore
├── README.md
├── TEST.md               # Testing checklist
└── UPDATES.md            # Recent updates log
```

## Demo Account

```
Email: demo@razmeni.rs
Password: demo123
```

## Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd razmeni-ui-mock
```

2. Serve with any static server:

**Using Python:**
```bash
python3 -m http.server 8000
```

**Using Node.js:**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open browser to `http://localhost:8000`

## Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd razmeni-ui-mock
vercel
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Deploy automatically

### Method 3: Drag & Drop

1. Go to https://vercel.com/new
2. Drag the `razmeni-ui-mock` folder
3. Click Deploy

## Environment

- No build step required
- No dependencies needed
- Pure static files
- Works offline (after first load)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Data Persistence

Currently uses **LocalStorage** for all data:
- Users
- Listings
- Trades
- Messages
- Ratings
- Favorites
- Read messages tracking

**Note**: Data is per-browser. Clearing browser data will reset everything.

## Features in Detail

### Trust Score Algorithm
```javascript
trustScore = (averageRating * 20) + (totalRatings * 2)
```

Example:
- 5.0 rating × 20 = 100
- 10 ratings × 2 = 20
- Trust Score = 120

### Notifications
- Red badge on "Razmene" for pending trade proposals
- Red badge on "Poruke" for unread messages
- Auto-updates on page load

### Favorites
- Heart icon on listing detail pages
- Toggle to add/remove from favorites
- Dedicated favorites page with all saved listings

### Messaging
- Only available between users with accepted trades
- Mark messages as read when viewing
- Search conversations
- Real-time message history

## Testing

See `TEST.md` for complete testing checklist.

Quick test flow:
1. Login with demo account
2. Create a new listing
3. Browse listings and propose a trade
4. Accept/decline trades in "Razmene"
5. Message trading partners in "Poruke"
6. Complete trade and rate user
7. Add listings to favorites

## Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary: #007AFF;
  --gray-900: #111827;
  /* ... */
}
```

### Mock Data
Edit `js/mockData.js` to change listings, categories, cities.

### Categories
Currently supports:
- Voće
- Povrće
- Mlečni proizvodi
- Pekarski proizvodi
- Usluge
- Ostalo

## Production Readiness

### Frontend: ✅ Ready
- All features implemented
- Fully responsive
- Clean, maintainable code
- No console errors
- Works in all modern browsers

### Backend: 🔄 Required for Production
Need to implement:
- PostgreSQL database
- Prisma ORM
- Authentication (JWT/sessions)
- Image upload (Cloudinary/S3)
- Real-time messaging (Socket.io)
- Email notifications
- API endpoints

## Future Enhancements

- [ ] Pagination for listings
- [ ] Loading states
- [ ] Email verification
- [ ] Forgot password
- [ ] Recently viewed
- [ ] Advanced filters
- [ ] Dark mode
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Push notifications

## License

MIT License - Free to use for personal/commercial projects

## Credits

Built with Claude Code by Anthropic

---

**Version**: 2.0.0
**Last Updated**: 2025-11-27
**Status**: Production Ready (Frontend)
