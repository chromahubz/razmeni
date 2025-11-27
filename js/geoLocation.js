// Geo-Location sistem za Razmeni platformu

class GeoLocationSystem {
  constructor() {
    // Predefinisana meetup mesta za svaki grad
    this.meetupLocations = {
      'Beograd': [
        { name: 'Kalemegdan Park', lat: 44.8225, lng: 20.4508, address: 'Kalemegdan, Beograd', type: 'park' },
        { name: 'Ada Ciganlija', lat: 44.7931, lng: 20.4080, address: 'Ada Ciganlija, Beograd', type: 'park' },
        { name: 'Trg Republike', lat: 44.8176, lng: 20.4606, address: 'Trg Republike, Beograd', type: 'square' },
        { name: 'Ušće Shopping Center', lat: 44.8166, lng: 20.4388, address: 'Ušće, Novi Beograd', type: 'mall' },
        { name: 'Zeleni Venac', lat: 44.8142, lng: 20.4561, address: 'Zeleni Venac, Beograd', type: 'market' }
      ],
      'Novi Sad': [
        { name: 'Trg Slobode', lat: 45.2551, lng: 19.8451, address: 'Trg Slobode, Novi Sad', type: 'square' },
        { name: 'Petrovaradinska Tvrđava', lat: 45.2532, lng: 19.8595, address: 'Petrovaradin, Novi Sad', type: 'park' },
        { name: 'Štrand', lat: 45.2426, lng: 19.8377, address: 'Štrand, Novi Sad', type: 'beach' },
        { name: 'BIG Shopping Center', lat: 45.2462, lng: 19.8189, address: 'BIG, Novi Sad', type: 'mall' }
      ],
      'Niš': [
        { name: 'Trg Kralja Milana', lat: 43.3209, lng: 21.8954, address: 'Centar, Niš', type: 'square' },
        { name: 'Tvrđava', lat: 43.3209, lng: 21.8954, address: 'Tvrđava, Niš', type: 'park' },
        { name: 'Delta Planet', lat: 43.3183, lng: 21.8939, address: 'Delta Planet, Niš', type: 'mall' }
      ]
    };

    // Koordinate gradova (aproximativne)
    this.cityCoordinates = {
      'Beograd': { lat: 44.8125, lng: 20.4612 },
      'Novi Sad': { lat: 45.2671, lng: 19.8335 },
      'Niš': { lat: 43.3209, lng: 21.8958 },
      'Kragujevac': { lat: 44.0125, lng: 20.9114 },
      'Subotica': { lat: 46.1005, lng: 19.6674 },
      'Zrenjanin': { lat: 45.3833, lng: 20.3833 },
      'Pančevo': { lat: 44.8711, lng: 20.6411 },
      'Čačak': { lat: 43.8914, lng: 20.3497 },
      'Kruševac': { lat: 43.5800, lng: 21.3300 },
      'Kraljevo': { lat: 43.7253, lng: 20.6869 }
    };
  }

  // Dodaj koordinate listing-u na osnovu grada
  addCoordinatesToListing(listing) {
    const cityCoords = this.cityCoordinates[listing.city];

    if (cityCoords) {
      // Dodaj mali random offset za raznolikost
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;

      return {
        ...listing,
        latitude: cityCoords.lat + latOffset,
        longitude: cityCoords.lng + lngOffset
      };
    }

    return listing;
  }

  // Izračunaj udaljenost između dve tačke (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius Zemlje u km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Udaljenost u km

    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Filtriraj listings po radius-u
  filterByRadius(listings, centerLat, centerLng, radiusKm) {
    return listings.filter(listing => {
      if (!listing.latitude || !listing.longitude) return false;

      const distance = this.calculateDistance(
        centerLat,
        centerLng,
        listing.latitude,
        listing.longitude
      );

      return distance <= radiusKm;
    }).map(listing => ({
      ...listing,
      distance: this.calculateDistance(
        centerLat,
        centerLng,
        listing.latitude,
        listing.longitude
      )
    })).sort((a, b) => a.distance - b.distance);
  }

  // Dobavi meetup lokacije za grad
  getMeetupLocations(city) {
    return this.meetupLocations[city] || [];
  }

  // Pronađi najbližu meetup lokaciju
  findNearestMeetup(lat, lng, city) {
    const locations = this.getMeetupLocations(city);

    if (locations.length === 0) return null;

    let nearest = locations[0];
    let minDistance = this.calculateDistance(lat, lng, nearest.lat, nearest.lng);

    locations.forEach(location => {
      const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });

    return {
      ...nearest,
      distance: minDistance
    };
  }

  // Dobavi trenutnu lokaciju korisnika (browser geolocation API)
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation nije podržan u ovom pretraživaču'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        error => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  // Dobavi listings u blizini korisnika
  async getNearbyListings(radiusKm = 10) {
    try {
      const position = await this.getCurrentPosition();
      const allListings = dataManager.getListings();

      // Dodaj koordinate svim listings-ima koji ih nemaju
      const listingsWithCoords = allListings.map(listing => {
        if (!listing.latitude || !listing.longitude) {
          return this.addCoordinatesToListing(listing);
        }
        return listing;
      });

      // Filtriraj po radius-u
      return this.filterByRadius(
        listingsWithCoords,
        position.latitude,
        position.longitude,
        radiusKm
      );
    } catch (error) {
      console.error('Greška pri dobijanju lokacije:', error);
      throw error;
    }
  }

  // Generiši Google Maps link za navigaciju
  generateMapsLink(lat, lng, label = '') {
    const labelParam = label ? `&query_place_id=${encodeURIComponent(label)}` : '';
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}${labelParam}`;
  }

  // Dobavi listings grupisane po gradovima za mapu
  getListingsByCity() {
    const listings = dataManager.getListings();
    const grouped = {};

    listings.forEach(listing => {
      if (!grouped[listing.city]) {
        grouped[listing.city] = [];
      }

      // Dodaj koordinate ako ih nema
      const listingWithCoords = listing.latitude && listing.longitude
        ? listing
        : this.addCoordinatesToListing(listing);

      grouped[listing.city].push(listingWithCoords);
    });

    return grouped;
  }

  // Predloži najbližu meetup lokaciju za razmenu
  suggestMeetupLocation(listing1City, listing2City) {
    // Ako su u istom gradu, predloži meetup mesta u tom gradu
    if (listing1City === listing2City) {
      const locations = this.getMeetupLocations(listing1City);
      if (locations.length > 0) {
        // Random meetup mesto
        return locations[Math.floor(Math.random() * locations.length)];
      }
    }

    // Ako su u različitim gradovima, predloži mesto između
    const city1Coords = this.cityCoordinates[listing1City];
    const city2Coords = this.cityCoordinates[listing2City];

    if (city1Coords && city2Coords) {
      const midLat = (city1Coords.lat + city2Coords.lat) / 2;
      const midLng = (city1Coords.lng + city2Coords.lng) / 2;

      // Nađi najbliži grad sredini
      let nearestCity = null;
      let minDistance = Infinity;

      Object.entries(this.cityCoordinates).forEach(([city, coords]) => {
        const distance = this.calculateDistance(midLat, midLng, coords.lat, coords.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      });

      if (nearestCity) {
        return {
          city: nearestCity,
          suggestion: `Predlažemo ${nearestCity} kao mesto između ${listing1City} i ${listing2City}`,
          meetupSpots: this.getMeetupLocations(nearestCity)
        };
      }
    }

    return null;
  }
}

// Inicijalizuj geo-location sistem
const geoLocationSystem = new GeoLocationSystem();

// Automatski dodaj koordinate svim postojećim listings-ima
document.addEventListener('DOMContentLoaded', function() {
  try {
    const listings = JSON.parse(localStorage.getItem('listings') || '[]');
    const updatedListings = listings.map(listing =>
      geoLocationSystem.addCoordinatesToListing(listing)
    );
    localStorage.setItem('listings', JSON.stringify(updatedListings));
  } catch (error) {
    console.error('Greška pri dodavanju koordinata:', error);
  }
});
