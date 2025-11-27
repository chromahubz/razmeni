// LocalStorage Data Manager

class DataManager {
  constructor() {
    this.init();
  }

  init() {
    try {
      // Initialize with mock data if empty
      if (!localStorage.getItem('users')) {
        this.seedInitialData();
      }
    } catch (error) {
      console.error('localStorage nije dostupan:', error);
      alert('Upozorenje: Podaci neće biti sačuvani. Molimo omogućite localStorage u vašem pretraživaču.');
    }
  }

  seedInitialData() {
    try {
      // Seed users
      const users = [
        {
          id: 1,
          email: 'demo@razmeni.rs',
          password: 'demo123', // In real app, this would be hashed
          fullName: 'Demo Korisnik',
          phone: '060 123 4567',
          locationCity: 'Beograd',
          avatarUrl: null,
          trustScore: 85,
          averageRating: 4.5,
          totalRatings: 12,
          totalTrades: 15,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(users));

      // Seed listings with mock data
      localStorage.setItem('listings', JSON.stringify(mockListings));

      // Initialize empty arrays
      localStorage.setItem('trades', JSON.stringify([]));
      localStorage.setItem('messages', JSON.stringify([]));
      localStorage.setItem('ratings', JSON.stringify([]));
      localStorage.setItem('favorites', JSON.stringify([]));

      // Current user (null = not logged in)
      localStorage.setItem('currentUser', null);
    } catch (error) {
      console.error('Greška pri inicijalizaciji podataka:', error);
    }
  }

  // Auth Methods
  login(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }

      return { success: false, error: 'Pogrešan email ili lozinka' };
    } catch (error) {
      console.error('Greška pri logovanju:', error);
      return { success: false, error: 'Greška pri logovanju. Pokušajte ponovo.' };
    }
  }

  register(userData) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if email exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email već postoji' };
      }

      const newUser = {
        id: users.length + 1,
        ...userData,
        trustScore: 0,
        averageRating: 0,
        totalRatings: 0,
        totalTrades: 0,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Greška pri registraciji:', error);
      return { success: false, error: 'Greška pri registraciji. Pokušajte ponovo.' };
    }
  }

  logout() {
    try {
      localStorage.setItem('currentUser', null);
    } catch (error) {
      console.error('Greška pri odjavljivanju:', error);
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr && userStr !== 'null' ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Greška pri čitanju korisnika:', error);
      return null;
    }
  }

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Listings Methods
  getListings(filters = {}) {
    try {
      let listings = JSON.parse(localStorage.getItem('listings') || '[]');

      if (filters.category) {
        listings = listings.filter(l => l.category === filters.category);
      }

      if (filters.city) {
        listings = listings.filter(l =>
          l.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        listings = listings.filter(l =>
          l.title.toLowerCase().includes(search) ||
          l.description.toLowerCase().includes(search)
        );
      }

      if (filters.sort) {
        switch (filters.sort) {
          case 'newest':
            listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            listings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'price-low':
            listings.sort((a, b) => a.points - b.points);
            break;
          case 'price-high':
            listings.sort((a, b) => b.points - a.points);
            break;
        }
      }

      return listings;
    } catch (error) {
      console.error('Greška pri čitanju oglasa:', error);
      return [];
    }
  }

  getListingById(id) {
    try {
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      return listings.find(l => l.id === parseInt(id));
    } catch (error) {
      console.error('Greška pri čitanju oglasa:', error);
      return null;
    }
  }

  createListing(listingData) {
    try {
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Morate biti prijavljeni' };
      }

      const newListing = {
        id: listings.length + 1,
        userId: currentUser.id,
        ...listingData,
        user: {
          id: currentUser.id,
          name: currentUser.fullName,
          avatar: currentUser.avatarUrl,
          trustScore: currentUser.trustScore,
          totalRatings: currentUser.totalRatings,
          totalTrades: currentUser.totalTrades
        },
        createdAt: new Date().toISOString()
      };

      listings.push(newListing);
      localStorage.setItem('listings', JSON.stringify(listings));

      return { success: true, listing: newListing };
    } catch (error) {
      console.error('Greška pri kreiranju oglasa:', error);
      return { success: false, error: 'Greška pri kreiranju oglasa. Pokušajte ponovo.' };
    }
  }

  updateListing(id, updates) {
    try {
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');
      const index = listings.findIndex(l => l.id === parseInt(id));

      if (index === -1) {
        return { success: false, error: 'Oglas nije pronađen' };
      }

      listings[index] = { ...listings[index], ...updates };
      localStorage.setItem('listings', JSON.stringify(listings));

      return { success: true, listing: listings[index] };
    } catch (error) {
      console.error('Greška pri ažuriranju oglasa:', error);
      return { success: false, error: 'Greška pri ažuriranju oglasa. Pokušajte ponovo.' };
    }
  }

  deleteListing(id) {
    try {
      let listings = JSON.parse(localStorage.getItem('listings') || '[]');
      listings = listings.filter(l => l.id !== parseInt(id));
      localStorage.setItem('listings', JSON.stringify(listings));

      return { success: true };
    } catch (error) {
      console.error('Greška pri brisanju oglasa:', error);
      return { success: false, error: 'Greška pri brisanju oglasa. Pokušajte ponovo.' };
    }
  }

  // Trades Methods
  getTrades(userId = null) {
    try {
      let trades = JSON.parse(localStorage.getItem('trades') || '[]');

      if (userId) {
        trades = trades.filter(t =>
          t.requesterId === userId || t.ownerId === userId
        );
      }

      return trades;
    } catch (error) {
      console.error('Greška pri čitanju razmena:', error);
      return [];
    }
  }

  createTrade(tradeData) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Morate biti prijavljeni' };
      }

      const newTrade = {
        id: trades.length + 1,
        requesterId: currentUser.id,
        ...tradeData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      trades.push(newTrade);
      localStorage.setItem('trades', JSON.stringify(trades));

      return { success: true, trade: newTrade };
    } catch (error) {
      console.error('Greška pri kreiranju razmene:', error);
      return { success: false, error: 'Greška pri kreiranju razmene. Pokušajte ponovo.' };
    }
  }

  updateTradeStatus(tradeId, status) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      const index = trades.findIndex(t => t.id === parseInt(tradeId));

      if (index === -1) {
        return { success: false, error: 'Razmena nije pronađena' };
      }

      trades[index].status = status;
      if (status === 'completed') {
        trades[index].completedAt = new Date().toISOString();
      }

      localStorage.setItem('trades', JSON.stringify(trades));

      return { success: true, trade: trades[index] };
    } catch (error) {
      console.error('Greška pri ažuriranju razmene:', error);
      return { success: false, error: 'Greška pri ažuriranju razmene. Pokušajte ponovo.' };
    }
  }

  // Messages Methods
  getMessages(tradeId) {
    try {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      return messages.filter(m => m.tradeId === parseInt(tradeId));
    } catch (error) {
      console.error('Greška pri čitanju poruka:', error);
      return [];
    }
  }

  sendMessage(messageData) {
    try {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Morate biti prijavljeni' };
      }

      const newMessage = {
        id: messages.length + 1,
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        ...messageData,
        createdAt: new Date().toISOString()
      };

      messages.push(newMessage);
      localStorage.setItem('messages', JSON.stringify(messages));

      return { success: true, message: newMessage };
    } catch (error) {
      console.error('Greška pri slanju poruke:', error);
      return { success: false, error: 'Greška pri slanju poruke. Pokušajte ponovo.' };
    }
  }

  // Ratings Methods
  createRating(ratingData) {
    try {
      const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Morate biti prijavljeni' };
      }

      const newRating = {
        id: ratings.length + 1,
        fromUserId: currentUser.id,
        ...ratingData,
        createdAt: new Date().toISOString()
      };

      ratings.push(newRating);
      localStorage.setItem('ratings', JSON.stringify(ratings));

      // Update user stats
      this.updateUserRating(ratingData.toUserId);

      return { success: true, rating: newRating };
    } catch (error) {
      console.error('Greška pri kreiranju ocene:', error);
      return { success: false, error: 'Greška pri kreiranju ocene. Pokušajte ponovo.' };
    }
  }

  updateUserRating(userId) {
    try {
      const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
      const userRatings = ratings.filter(r => r.toUserId === userId);

      if (userRatings.length === 0) return;

      const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
      const trustScore = Math.round((avgRating * 20) + (userRatings.length * 2));

      // Update user
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex !== -1) {
        users[userIndex].averageRating = avgRating;
        users[userIndex].totalRatings = userRatings.length;
        users[userIndex].trustScore = trustScore;
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user if it's them
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
      }
    } catch (error) {
      console.error('Greška pri ažuriranju korisničke ocene:', error);
    }
  }

  // Favorites Methods
  toggleFavorite(listingId) {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        return { success: false, error: 'Morate biti prijavljeni' };
      }

      const index = favorites.findIndex(f =>
        f.userId === currentUser.id && f.listingId === listingId
      );

      if (index === -1) {
        // Add to favorites
        favorites.push({
          id: favorites.length + 1,
          userId: currentUser.id,
          listingId,
          createdAt: new Date().toISOString()
        });
      } else {
        // Remove from favorites
        favorites.splice(index, 1);
      }

      localStorage.setItem('favorites', JSON.stringify(favorites));

      return { success: true, isFavorite: index === -1 };
    } catch (error) {
      console.error('Greška pri izmeni favorita:', error);
      return { success: false, error: 'Greška pri izmeni favorita. Pokušajte ponovo.' };
    }
  }

  isFavorite(listingId) {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const currentUser = this.getCurrentUser();

      if (!currentUser) return false;

      return favorites.some(f =>
        f.userId === currentUser.id && f.listingId === listingId
      );
    } catch (error) {
      console.error('Greška pri proveri favorita:', error);
      return false;
    }
  }

  // Notifications Methods
  getUnreadMessagesCount() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return 0;

      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const readMessages = JSON.parse(localStorage.getItem('readMessages') || '[]');

      // Get all trades for current user
      const myTrades = this.getTrades(currentUser.id);
      const myTradeIds = myTrades.map(t => t.id);

      // Count unread messages in my trades
      let unreadCount = 0;
      myTradeIds.forEach(tradeId => {
        const tradeMessages = messages.filter(m => m.tradeId === tradeId && m.senderId !== currentUser.id);
        tradeMessages.forEach(msg => {
          const isRead = readMessages.some(r => r.userId === currentUser.id && r.messageId === msg.id);
          if (!isRead) unreadCount++;
        });
      });

      return unreadCount;
    } catch (error) {
      console.error('Greška pri brojanju nepročitanih poruka:', error);
      return 0;
    }
  }

  getPendingTradesCount() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return 0;

      const trades = this.getTrades(currentUser.id);
      // Count pending trades where current user is the owner (received proposals)
      return trades.filter(t => t.status === 'pending' && t.ownerId === currentUser.id).length;
    } catch (error) {
      console.error('Greška pri brojanju razmena na čekanju:', error);
      return 0;
    }
  }

  markMessageAsRead(messageId) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return;

      const readMessages = JSON.parse(localStorage.getItem('readMessages') || '[]');

      if (!readMessages.some(r => r.userId === currentUser.id && r.messageId === messageId)) {
        readMessages.push({
          userId: currentUser.id,
          messageId: messageId,
          readAt: new Date().toISOString()
        });
        localStorage.setItem('readMessages', JSON.stringify(readMessages));
      }
    } catch (error) {
      console.error('Greška pri označavanju poruke kao pročitane:', error);
    }
  }

  markAllMessagesAsRead(tradeId) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return;

      const messages = this.getMessages(tradeId);
      messages.forEach(msg => {
        if (msg.senderId !== currentUser.id) {
          this.markMessageAsRead(msg.id);
        }
      });
    } catch (error) {
      console.error('Greška pri označavanju svih poruka kao pročitanih:', error);
    }
  }
}

// Initialize global data manager
const dataManager = new DataManager();
