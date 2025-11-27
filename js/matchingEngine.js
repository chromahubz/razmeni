// Smart Matching Engine za Razmeni platformu

class MatchingEngine {
  constructor() {
    this.matchCache = new Map();
  }

  // Pronađi potencijalne matchove za korisnika
  findMatches(userId) {
    try {
      const userListings = dataManager.getListings().filter(l => l.userId === userId);
      const otherListings = dataManager.getListings().filter(l => l.userId !== userId);

      if (userListings.length === 0) {
        return [];
      }

      const matches = [];

      // 1. Direct matches - kada drugi korisnik ima nešto što ti tražiš
      userListings.forEach(myListing => {
        otherListings.forEach(theirListing => {
          const score = this.calculateMatchScore(myListing, theirListing);

          if (score > 50) { // Threshold za match
            matches.push({
              type: 'direct',
              score: score,
              myListing: myListing,
              theirListing: theirListing,
              otherUser: theirListing.user,
              message: this.generateMatchMessage('direct', myListing, theirListing)
            });
          }
        });
      });

      // 2. Category matches - ista kategorija
      const categoryMatches = this.findCategoryMatches(userId, userListings, otherListings);
      matches.push(...categoryMatches);

      // 3. Location-based matches - ista lokacija
      const locationMatches = this.findLocationMatches(userId, userListings, otherListings);
      matches.push(...locationMatches);

      // Sortiraj po score-u
      return matches.sort((a, b) => b.score - a.score).slice(0, 10);
    } catch (error) {
      console.error('Greška pri traženju matchova:', error);
      return [];
    }
  }

  // Izračunaj skor kompatibilnosti između dva oglasa
  calculateMatchScore(listing1, listing2) {
    let score = 0;

    // Kategorija match (40 poena)
    if (listing1.category === listing2.category) {
      score += 40;
    }

    // Lokacija match (30 poena)
    if (listing1.city === listing2.city) {
      score += 30;
    }

    // Poeni sličnost (20 poena)
    const pointsDiff = Math.abs(listing1.points - listing2.points);
    if (pointsDiff <= 10) {
      score += 20;
    } else if (pointsDiff <= 30) {
      score += 10;
    }

    // Trust score similarity (10 poena)
    const trustDiff = Math.abs(listing1.user.trustScore - listing2.user.trustScore);
    if (trustDiff <= 20) {
      score += 10;
    }

    return score;
  }

  // Pronađi matchove u istoj kategoriji
  findCategoryMatches(userId, userListings, otherListings) {
    const matches = [];
    const userCategories = [...new Set(userListings.map(l => l.category))];

    userCategories.forEach(category => {
      const categoryListings = otherListings.filter(l => l.category === category);

      categoryListings.forEach(listing => {
        matches.push({
          type: 'category',
          score: 60,
          myListing: userListings.find(l => l.category === category),
          theirListing: listing,
          otherUser: listing.user,
          message: `${listing.user.name} takođe nudi ${listing.categoryName} - mogla bi biti dobra razmena!`
        });
      });
    });

    return matches.slice(0, 5);
  }

  // Pronađi matchove u istoj lokaciji
  findLocationMatches(userId, userListings, otherListings) {
    const matches = [];
    const userCities = [...new Set(userListings.map(l => l.city))];

    userCities.forEach(city => {
      const cityListings = otherListings.filter(l => l.city === city && l.offersPickup);

      cityListings.forEach(listing => {
        matches.push({
          type: 'location',
          score: 55,
          myListing: userListings[0],
          theirListing: listing,
          otherUser: listing.user,
          message: `${listing.user.name} je u ${city} - lako preuzimanje!`
        });
      });
    });

    return matches.slice(0, 5);
  }

  // Pronađi chain trade mogućnosti (A→B→C→A)
  findChainTrades(userId) {
    try {
      const allListings = dataManager.getListings();
      const userListings = allListings.filter(l => l.userId === userId);

      if (userListings.length === 0) return [];

      const chains = [];

      // Jednostavan chain: A ima X, želi Y; B ima Y, želi Z; C ima Z, želi X
      userListings.forEach(myListing => {
        const secondStep = allListings.filter(l =>
          l.userId !== userId &&
          this.calculateMatchScore(myListing, l) > 40
        );

        secondStep.forEach(step2 => {
          const thirdStep = allListings.filter(l =>
            l.userId !== userId &&
            l.userId !== step2.userId &&
            this.calculateMatchScore(step2, l) > 40 &&
            this.calculateMatchScore(l, myListing) > 40
          );

          thirdStep.forEach(step3 => {
            chains.push({
              type: 'chain',
              participants: [
                { listing: myListing, user: myListing.user },
                { listing: step2, user: step2.user },
                { listing: step3, user: step3.user }
              ],
              score: 85,
              message: 'Lanac razmene: Ti → ' + step2.user.name + ' → ' + step3.user.name + ' → Ti!'
            });
          });
        });
      });

      return chains.slice(0, 3);
    } catch (error) {
      console.error('Greška pri traženju chain trades:', error);
      return [];
    }
  }

  // Generiši poruku za match
  generateMatchMessage(type, myListing, theirListing) {
    const templates = {
      direct: `Perfektan match! Razmeni "${myListing.title}" za "${theirListing.title}" sa ${theirListing.user.name}`,
      category: `${theirListing.user.name} takođe ima ${theirListing.categoryName} - pogledaj!`,
      location: `${theirListing.user.name} je blizu tebe (${theirListing.city})`,
    };

    return templates[type] || 'Potencijalna razmena!';
  }

  // Notifikacije kada neko postavi oglas koji ti treba
  checkWishlistMatches(newListingId) {
    try {
      const newListing = dataManager.getListingById(newListingId);
      if (!newListing) return [];

      const wishlists = JSON.parse(localStorage.getItem('wishlists') || '[]');
      const notifications = [];

      wishlists.forEach(wishlist => {
        if (wishlist.userId === newListing.userId) return; // Ne notifikuj samog sebe

        // Proveri da li novi oglas match-uje wishlist
        const categoryMatch = wishlist.category === newListing.category;
        const cityMatch = !wishlist.city || wishlist.city === newListing.city;
        const pointsMatch = !wishlist.maxPoints || newListing.points <= wishlist.maxPoints;

        if (categoryMatch && cityMatch && pointsMatch) {
          notifications.push({
            userId: wishlist.userId,
            listingId: newListingId,
            message: `Novi oglas match-uje tvoju wishlist: ${newListing.title}`,
            type: 'wishlist_match',
            createdAt: new Date().toISOString()
          });
        }
      });

      // Sačuvaj notifikacije
      if (notifications.length > 0) {
        const existing = JSON.parse(localStorage.getItem('matchNotifications') || '[]');
        localStorage.setItem('matchNotifications', JSON.stringify([...existing, ...notifications]));
      }

      return notifications;
    } catch (error) {
      console.error('Greška pri proveri wishlist matchova:', error);
      return [];
    }
  }

  // Dobavi notifikacije za korisnika
  getNotifications(userId) {
    try {
      const all = JSON.parse(localStorage.getItem('matchNotifications') || '[]');
      return all.filter(n => n.userId === userId);
    } catch (error) {
      console.error('Greška pri čitanju notifikacija:', error);
      return [];
    }
  }

  // Označi notifikaciju kao pročitanu
  markNotificationRead(notificationId) {
    try {
      let notifications = JSON.parse(localStorage.getItem('matchNotifications') || '[]');
      notifications = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem('matchNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Greška pri označavanju notifikacije:', error);
    }
  }
}

// Inicijalizuj matching engine
const matchingEngine = new MatchingEngine();
