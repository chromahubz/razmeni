// Gamification sistem za Razmeni platformu

class GamificationSystem {
  constructor() {
    this.levels = [
      { level: 1, name: 'Bronze', minPoints: 0, maxPoints: 99, color: '#CD7F32', icon: '🥉' },
      { level: 2, name: 'Silver', minPoints: 100, maxPoints: 299, color: '#C0C0C0', icon: '🥈' },
      { level: 3, name: 'Gold', minPoints: 300, maxPoints: 699, color: '#FFD700', icon: '🥇' },
      { level: 4, name: 'Platinum', minPoints: 700, maxPoints: 1499, color: '#E5E4E2', icon: '💎' },
      { level: 5, name: 'Diamond', minPoints: 1500, maxPoints: Infinity, color: '#B9F2FF', icon: '💠' }
    ];

    this.achievements = [
      {
        id: 'first_trade',
        name: 'Prva razmena',
        description: 'Završi svoju prvu razmenu',
        icon: '🎯',
        points: 10,
        condition: (user) => user.totalTrades >= 1
      },
      {
        id: 'trader_5',
        name: 'Iskusan trader',
        description: 'Završi 5 razmena',
        icon: '⭐',
        points: 25,
        condition: (user) => user.totalTrades >= 5
      },
      {
        id: 'trader_10',
        name: 'Profesionalac',
        description: 'Završi 10 razmena',
        icon: '🌟',
        points: 50,
        condition: (user) => user.totalTrades >= 10
      },
      {
        id: 'trader_25',
        name: 'Majstor razmene',
        description: 'Završi 25 razmena',
        icon: '💫',
        points: 100,
        condition: (user) => user.totalTrades >= 25
      },
      {
        id: 'trader_50',
        name: 'Legenda',
        description: 'Završi 50 razmena',
        icon: '👑',
        points: 200,
        condition: (user) => user.totalTrades >= 50
      },
      {
        id: 'points_100',
        name: 'Sakupljač',
        description: 'Zaради 100 poena kroz razmene',
        icon: '💰',
        points: 20,
        condition: (user) => this.getTotalPointsEarned(user.id) >= 100
      },
      {
        id: 'points_500',
        name: 'Bogataš',
        description: 'Zaради 500 poena kroz razmene',
        icon: '💎',
        points: 75,
        condition: (user) => this.getTotalPointsEarned(user.id) >= 500
      },
      {
        id: 'points_1000',
        name: 'Milijonaš',
        description: 'Zaради 1000 poena kroz razmene',
        icon: '👑',
        points: 150,
        condition: (user) => this.getTotalPointsEarned(user.id) >= 1000
      },
      {
        id: 'trust_score_80',
        name: 'Pouzdan',
        description: 'Postigne Trust Score od 80+',
        icon: '✅',
        points: 30,
        condition: (user) => user.trustScore >= 80
      },
      {
        id: 'trust_score_90',
        name: 'Veoma pouzdan',
        description: 'Postigne Trust Score od 90+',
        icon: '⭐',
        points: 60,
        condition: (user) => user.trustScore >= 90
      },
      {
        id: 'five_star',
        name: 'Savršenstvo',
        description: 'Dobij prosečnu ocenu 5.0',
        icon: '🌟',
        points: 100,
        condition: (user) => user.averageRating >= 5.0
      },
      {
        id: 'early_bird',
        name: 'Rana ptica',
        description: 'Završi razmenu pre 8:00 ujutru',
        icon: '🌅',
        points: 15,
        condition: (user) => this.hasEarlyMorningTrade(user.id)
      },
      {
        id: 'night_owl',
        name: 'Noćna ptica',
        description: 'Završi razmenu posle 22:00',
        icon: '🌙',
        points: 15,
        condition: (user) => this.hasLateNightTrade(user.id)
      },
      {
        id: 'speed_trader',
        name: 'Brzi trader',
        description: 'Završi razmenu za manje od 1 sata od predloga',
        icon: '⚡',
        points: 25,
        condition: (user) => this.hasSpeedTrade(user.id)
      },
      {
        id: 'local_hero',
        name: 'Lokalni heroj',
        description: 'Završi 10 razmena u svom gradu',
        icon: '🏙️',
        points: 40,
        condition: (user) => this.getLocalTradesCount(user.id) >= 10
      },
      {
        id: 'reviewer',
        name: 'Recenzent',
        description: 'Ostavi 10 recenzija',
        icon: '📝',
        points: 20,
        condition: (user) => this.getReviewsGivenCount(user.id) >= 10
      }
    ];
  }

  // Dobavi nivo korisnika
  getUserLevel(user) {
    const totalPoints = this.getTotalGamificationPoints(user.id);
    return this.levels.find(level =>
      totalPoints >= level.minPoints && totalPoints <= level.maxPoints
    ) || this.levels[0];
  }

  // Izračunaj ukupne gamification poene
  getTotalGamificationPoints(userId) {
    try {
      const achievements = this.getUserAchievements(userId);
      const achievementPoints = achievements.reduce((sum, a) => sum + a.points, 0);

      // Dodaj bonus poene iz reward sistema
      const rewards = JSON.parse(localStorage.getItem('userRewards') || '[]');
      const userRewards = rewards.filter(r => r.userId === userId);
      const rewardPoints = userRewards.reduce((sum, r) => sum + (r.points || 0), 0);

      return achievementPoints + rewardPoints;
    } catch (error) {
      console.error('Greška pri računanju gamification poena:', error);
      return 0;
    }
  }

  // Dobavi achievement-e korisnika
  getUserAchievements(userId) {
    try {
      const unlocked = JSON.parse(localStorage.getItem('userAchievements') || '[]');
      return unlocked.filter(a => a.userId === userId);
    } catch (error) {
      console.error('Greška pri čitanju achievement-a:', error);
      return [];
    }
  }

  // Proveri i otkljucaj nove achievement-e
  checkAchievements(userId) {
    try {
      const user = this.getUserData(userId);
      if (!user) return [];

      const unlocked = this.getUserAchievements(userId);
      const unlockedIds = unlocked.map(a => a.achievementId);
      const newAchievements = [];

      this.achievements.forEach(achievement => {
        if (!unlockedIds.includes(achievement.id) && achievement.condition(user)) {
          // Otkljucaj achievement
          const newAchievement = {
            id: Date.now() + Math.random(),
            userId: userId,
            achievementId: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points,
            unlockedAt: new Date().toISOString()
          };

          unlocked.push(newAchievement);
          newAchievements.push(newAchievement);
        }
      });

      if (newAchievements.length > 0) {
        localStorage.setItem('userAchievements', JSON.stringify(unlocked));
      }

      return newAchievements;
    } catch (error) {
      console.error('Greška pri proveri achievement-a:', error);
      return [];
    }
  }

  // Dobavi korisničke podatke za gamification
  getUserData(userId) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find(u => u.id === userId);
    } catch (error) {
      return null;
    }
  }

  // Helper metode za achievement uslove
  getTotalPointsEarned(userId) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      const completedTrades = trades.filter(t =>
        t.status === 'completed' && t.requesterId === userId
      );
      return completedTrades.reduce((sum, t) => sum + (t.offeredPoints || 0), 0);
    } catch (error) {
      return 0;
    }
  }

  hasEarlyMorningTrade(userId) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      return trades.some(t => {
        if (t.status === 'completed' && (t.requesterId === userId || t.ownerId === userId)) {
          const completedTime = new Date(t.completedAt);
          return completedTime.getHours() < 8;
        }
        return false;
      });
    } catch (error) {
      return false;
    }
  }

  hasLateNightTrade(userId) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      return trades.some(t => {
        if (t.status === 'completed' && (t.requesterId === userId || t.ownerId === userId)) {
          const completedTime = new Date(t.completedAt);
          return completedTime.getHours() >= 22;
        }
        return false;
      });
    } catch (error) {
      return false;
    }
  }

  hasSpeedTrade(userId) {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      return trades.some(t => {
        if (t.status === 'completed' && (t.requesterId === userId || t.ownerId === userId)) {
          const created = new Date(t.createdAt);
          const completed = new Date(t.completedAt);
          const hoursDiff = (completed - created) / (1000 * 60 * 60);
          return hoursDiff < 1;
        }
        return false;
      });
    } catch (error) {
      return false;
    }
  }

  getLocalTradesCount(userId) {
    try {
      const user = this.getUserData(userId);
      if (!user) return 0;

      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      const listings = JSON.parse(localStorage.getItem('listings') || '[]');

      return trades.filter(t => {
        if (t.status === 'completed' && (t.requesterId === userId || t.ownerId === userId)) {
          const listing = listings.find(l => l.id === t.requestedListingId);
          return listing && listing.city === user.locationCity;
        }
        return false;
      }).length;
    } catch (error) {
      return 0;
    }
  }

  getReviewsGivenCount(userId) {
    try {
      const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
      return ratings.filter(r => r.fromUserId === userId).length;
    } catch (error) {
      return 0;
    }
  }

  // Dobavi leaderboard
  getLeaderboard(period = 'all', limit = 10) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      const leaderboard = users.map(user => ({
        userId: user.id,
        name: user.fullName,
        avatar: user.avatarUrl,
        level: this.getUserLevel(user),
        totalPoints: this.getTotalGamificationPoints(user.id),
        totalTrades: user.totalTrades,
        trustScore: user.trustScore,
        achievements: this.getUserAchievements(user.id).length
      }));

      // Sortiraj po ukupnim poenima
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

      return leaderboard.slice(0, limit);
    } catch (error) {
      console.error('Greška pri generisanju leaderboard-a:', error);
      return [];
    }
  }

  // Dodaj daily reward
  claimDailyReward(userId) {
    try {
      const rewards = JSON.parse(localStorage.getItem('userRewards') || '[]');
      const today = new Date().toDateString();

      // Proveri da li je već claim-ovao danas
      const todayReward = rewards.find(r =>
        r.userId === userId &&
        r.type === 'daily' &&
        new Date(r.claimedAt).toDateString() === today
      );

      if (todayReward) {
        return { success: false, error: 'Već si claim-ovao dnevni reward danas!' };
      }

      // Dodaj reward
      const newReward = {
        id: Date.now(),
        userId: userId,
        type: 'daily',
        points: 5,
        claimedAt: new Date().toISOString()
      };

      rewards.push(newReward);
      localStorage.setItem('userRewards', JSON.stringify(rewards));

      // Proveri nove achievement-e
      const newAchievements = this.checkAchievements(userId);

      return {
        success: true,
        reward: newReward,
        newAchievements: newAchievements
      };
    } catch (error) {
      console.error('Greška pri claim-ovanju reward-a:', error);
      return { success: false, error: 'Greška pri claim-ovanju reward-a' };
    }
  }
}

// Inicijalizuj gamification sistem
const gamificationSystem = new GamificationSystem();
