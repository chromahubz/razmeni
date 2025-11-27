// Mock podaci za Razmeni platformu

const mockListings = [
  {
    id: 1,
    title: 'Sveže jabuke idared - 10kg',
    description: 'Domaće jabuke sa sela kod Valjeva. Idealno za zimnice i domaće sokove. Bez hemikalija, sa organskom gnojidbe. Ubrano prošle nedelje, čuvano na hladnom.',
    category: 'voce',
    categoryIcon: '',
    categoryName: 'Voće',
    points: 50,
    quantity: 10,
    unit: 'kg',
    condition: 'Novo',
    city: 'Beograd',
    address: 'Voždovac',
    user: {
      id: 1,
      name: 'Marko Marković',
      avatar: null,
      trustScore: 85,
      totalRatings: 12,
      totalTrades: 15,
      memberSince: '2023-05-10'
    },
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-20T10:30:00'
  },
  {
    id: 2,
    title: 'Organski paradajz iz bašte - 5kg',
    description: 'Svež organski paradajz iz moje bašte. Idealan za salate i svakodnevnu upotrebu. Bez pesticida i veštačkih đubriva.',
    category: 'povrce',
    categoryIcon: '',
    categoryName: 'Povrće',
    points: 35,
    quantity: 5,
    unit: 'kg',
    condition: 'Novo',
    city: 'Novi Sad',
    address: 'Petrovaradin',
    user: {
      id: 2,
      name: 'Ana Anić',
      avatar: null,
      trustScore: 92,
      totalRatings: 24,
      totalTrades: 28,
      memberSince: '2023-02-15'
    },
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1546470427-227a2e3efcff?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: true,
    deliveryRadius: 10,
    createdAt: '2024-11-21T14:20:00'
  },
  {
    id: 3,
    title: 'Domaći med livadski - 1L',
    description: 'Prirodni livadski med sa Fruške Gore. Prikupljen ove godine u junu. Bogat ukus i pun vitamina. Bez dodataka.',
    category: 'ostalo',
    categoryIcon: '',
    categoryName: 'Ostalo',
    points: 80,
    quantity: 1,
    unit: 'L',
    condition: 'Novo',
    city: 'Novi Sad',
    address: 'Sremski Karlovci',
    user: {
      id: 3,
      name: 'Jovan Jovanović',
      avatar: null,
      trustScore: 78,
      totalRatings: 8,
      totalTrades: 9,
      memberSince: '2024-01-10'
    },
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784db4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-19T09:15:00'
  },
  {
    id: 4,
    title: 'Web dizajn i razvoj sajta - 5 sati',
    description: 'Nudim usluge web dizajna i razvoja. Profesionalni pristup, moderne tehnologije (React, Next.js). Portfolio dostupan na zahtev.',
    category: 'usluge',
    categoryIcon: '',
    categoryName: 'Usluge',
    points: 150,
    quantity: 5,
    unit: 'sati',
    condition: 'Usluga',
    city: 'Beograd',
    address: 'Centar',
    user: {
      id: 4,
      name: 'Petar Petrović',
      avatar: null,
      trustScore: 95,
      totalRatings: 31,
      totalTrades: 35,
      memberSince: '2022-11-20'
    },
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop'
    ],
    offersPickup: false,
    offersDelivery: false,
    createdAt: '2024-11-22T11:00:00'
  },
  {
    id: 5,
    title: 'Svež krompir sa polja - 20kg',
    description: 'Mlad krompir sa našeg polja. Odličan za pečenje i kuvanje. Bez hemikalija. Idealno za zimske zalihe.',
    category: 'povrce',
    categoryIcon: '',
    categoryName: 'Povrće',
    points: 40,
    quantity: 20,
    unit: 'kg',
    condition: 'Novo',
    city: 'Kragujevac',
    address: 'Aerodrom',
    user: {
      id: 5,
      name: 'Milica Milić',
      avatar: null,
      trustScore: 88,
      totalRatings: 16,
      totalTrades: 19,
      memberSince: '2023-07-05'
    },
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596803244535-2b8c0b6c83cc?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: true,
    deliveryRadius: 15,
    createdAt: '2024-11-18T16:45:00'
  },
  {
    id: 6,
    title: 'Domaći hleb - 5 vekni',
    description: 'Sveže pečen domaći hleb. Pšenično brašno, kvasac, malo soli. Bez konzervansa. Pečeno u peći na drva.',
    category: 'pekarski',
    categoryIcon: '',
    categoryName: 'Pekarski proizvodi',
    points: 25,
    quantity: 5,
    unit: 'kom',
    condition: 'Novo',
    city: 'Subotica',
    address: 'Centar',
    user: {
      id: 6,
      name: 'Dragana Dragić',
      avatar: null,
      trustScore: 90,
      totalRatings: 20,
      totalTrades: 22,
      memberSince: '2023-03-12'
    },
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595975090670-0fdd3c647e8e?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-23T07:30:00'
  },
  {
    id: 7,
    title: 'Sveže mleko sa sela - 10L',
    description: 'Domaće kravlje mleko direktno sa farme. Svakodnevno muža. Idealno za pravljenje sira, kajmaka ili piće.',
    category: 'mlecni',
    categoryIcon: '',
    categoryName: 'Mlečni proizvodi',
    points: 60,
    quantity: 10,
    unit: 'L',
    condition: 'Novo',
    city: 'Niš',
    address: 'Palilula',
    user: {
      id: 7,
      name: 'Stefan Stefanović',
      avatar: null,
      trustScore: 82,
      totalRatings: 11,
      totalTrades: 13,
      memberSince: '2023-09-01'
    },
    images: [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-22T06:00:00'
  },
  {
    id: 8,
    title: 'Sveže šljive - 15kg',
    description: 'Pozegače sa našeg imanja. Idealne za rakiju, džem i kompote. Slatke i zrele, ubrane juče.',
    category: 'voce',
    categoryIcon: '',
    categoryName: 'Voće',
    points: 45,
    quantity: 15,
    unit: 'kg',
    condition: 'Novo',
    city: 'Beograd',
    address: 'Rakovica',
    user: {
      id: 1,
      name: 'Marko Marković',
      avatar: null,
      trustScore: 85,
      totalRatings: 12,
      totalTrades: 15,
      memberSince: '2023-05-10'
    },
    images: [
      'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1630432168410-8cfbfe7d1da6?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-21T13:20:00'
  },
  {
    id: 9,
    title: 'Popravka bicikla i servisi - 2 sata',
    description: 'Nudim profesionalne servisne usluge za bicikle. Popravka, podešavanje menjača, zamena delova. 10+ godina iskustva.',
    category: 'usluge',
    categoryIcon: '',
    categoryName: 'Usluge',
    points: 50,
    quantity: 2,
    unit: 'sata',
    condition: 'Usluga',
    city: 'Novi Sad',
    address: 'Liman',
    user: {
      id: 8,
      name: 'Nikola Nikolić',
      avatar: null,
      trustScore: 94,
      totalRatings: 27,
      totalTrades: 30,
      memberSince: '2022-08-15'
    },
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&h=600&fit=crop'
    ],
    offersPickup: false,
    offersDelivery: false,
    createdAt: '2024-11-20T15:00:00'
  },
  {
    id: 10,
    title: 'Organski krastavci - 8kg',
    description: 'Sveži krastavci iz organske bašte. Bez hemikalija. Idealni za salate i kiseljenje. Ubrani danas ujutru.',
    category: 'povrce',
    categoryIcon: '',
    categoryName: 'Povrće',
    points: 30,
    quantity: 8,
    unit: 'kg',
    condition: 'Novo',
    city: 'Beograd',
    address: 'Zemun',
    user: {
      id: 2,
      name: 'Ana Anić',
      avatar: null,
      trustScore: 92,
      totalRatings: 24,
      totalTrades: 28,
      memberSince: '2023-02-15'
    },
    images: [
      'https://images.unsplash.com/photo-1589927986089-35812378d9a7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: true,
    deliveryRadius: 10,
    createdAt: '2024-11-23T08:30:00'
  },
  {
    id: 11,
    title: 'Domaće kiflice - 20 komada',
    description: 'Sveže pečene domaće kiflice. Klasične i sa eurokremom. Mekane i ukusne. Bez konzervansa.',
    category: 'pekarski',
    categoryIcon: '',
    categoryName: 'Pekarski proizvodi',
    points: 35,
    quantity: 20,
    unit: 'kom',
    condition: 'Novo',
    city: 'Kragujevac',
    address: 'Stanovo',
    user: {
      id: 6,
      name: 'Dragana Dragić',
      avatar: null,
      trustScore: 90,
      totalRatings: 20,
      totalTrades: 22,
      memberSince: '2023-03-12'
    },
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-22T05:45:00'
  },
  {
    id: 12,
    title: 'Domaći sir - 2kg',
    description: 'Svež domaći kačkavalj od kravjeg mleka. Odležao 2 meseca. Odličan ukus, prirodni sastojci.',
    category: 'mlecni',
    categoryIcon: '',
    categoryName: 'Mlečni proizvodi',
    points: 70,
    quantity: 2,
    unit: 'kg',
    condition: 'Novo',
    city: 'Subotica',
    address: 'Bajnat',
    user: {
      id: 7,
      name: 'Stefan Stefanović',
      avatar: null,
      trustScore: 82,
      totalRatings: 11,
      totalTrades: 13,
      memberSince: '2023-09-01'
    },
    images: [
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-21T10:00:00'
  },
  {
    id: 13,
    title: 'Instrukcije iz matematike - 10 časova',
    description: 'Profesionalne instrukcije iz matematike za srednju školu i fakultet. Diplomirani matematičar sa 5+ godina iskustva.',
    category: 'usluge',
    categoryIcon: '',
    categoryName: 'Usluge',
    points: 120,
    quantity: 10,
    unit: 'časova',
    condition: 'Usluga',
    city: 'Beograd',
    address: 'Vračar',
    user: {
      id: 9,
      name: 'Jelena Jelić',
      avatar: null,
      trustScore: 97,
      totalRatings: 42,
      totalTrades: 45,
      memberSince: '2022-03-10'
    },
    images: [
      'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=600&fit=crop'
    ],
    offersPickup: false,
    offersDelivery: false,
    createdAt: '2024-11-19T12:00:00'
  },
  {
    id: 14,
    title: 'Sveže jagode - 3kg',
    description: 'Crvene slatke jagode sa plantaže. Idealne za džem, kolače ili svežu konzumaciju. Ubrane danas.',
    category: 'voce',
    categoryIcon: '',
    categoryName: 'Voće',
    points: 55,
    quantity: 3,
    unit: 'kg',
    condition: 'Novo',
    city: 'Niš',
    address: 'Medijana',
    user: {
      id: 10,
      name: 'Ivana Ivanović',
      avatar: null,
      trustScore: 86,
      totalRatings: 14,
      totalTrades: 16,
      memberSince: '2023-06-20'
    },
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495570689269-d883b1224443?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: false,
    createdAt: '2024-11-23T09:15:00'
  },
  {
    id: 15,
    title: 'Organska paprika - 10kg',
    description: 'Sveža organska paprika raznih boja. Bez pesticida. Idealna za ajvar i zimnice. Sa certificiranog organskog gazdinstva.',
    category: 'povrce',
    categoryIcon: '',
    categoryName: 'Povrće',
    points: 45,
    quantity: 10,
    unit: 'kg',
    condition: 'Novo',
    city: 'Novi Sad',
    address: 'Futog',
    user: {
      id: 5,
      name: 'Milica Milić',
      avatar: null,
      trustScore: 88,
      totalRatings: 16,
      totalTrades: 19,
      memberSince: '2023-07-05'
    },
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=800&h=600&fit=crop'
    ],
    offersPickup: true,
    offersDelivery: true,
    deliveryRadius: 20,
    createdAt: '2024-11-20T14:30:00'
  }
];

// Helper funkcije
function getListingById(id) {
  return mockListings.find(listing => listing.id === parseInt(id));
}

function filterListings(filters = {}) {
  let filtered = [...mockListings];

  if (filters.category) {
    filtered = filtered.filter(l => l.category === filters.category);
  }

  if (filters.city) {
    filtered = filtered.filter(l => l.city === filters.city);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(search) ||
      l.description.toLowerCase().includes(search)
    );
  }

  if (filters.sort) {
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.points - b.points);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.points - a.points);
        break;
    }
  }

  return filtered;
}

function getRandomListings(count, excludeId = null) {
  let listings = [...mockListings];
  if (excludeId) {
    listings = listings.filter(l => l.id !== excludeId);
  }
  return listings.sort(() => 0.5 - Math.random()).slice(0, count);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHrs < 1) return 'Malopre';
  if (diffHrs < 24) return `Pre ${diffHrs}h`;
  if (diffDays === 1) return 'Juče';
  if (diffDays < 7) return `Pre ${diffDays} dana`;

  return date.toLocaleDateString('sr-RS');
}
