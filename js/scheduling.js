// Calendar & Scheduling sistem za Razmeni platformu

class SchedulingSystem {
  constructor() {
    this.reminderIntervals = {
      '1hour': 60 * 60 * 1000,
      '1day': 24 * 60 * 60 * 1000,
      '1week': 7 * 24 * 60 * 60 * 1000
    };
  }

  // Zakazi razmenu
  scheduleTradeExchange(tradeId, scheduledDate, scheduledTime, location, notes = '') {
    try {
      const trades = JSON.parse(localStorage.getItem('trades') || '[]');
      const trade = trades.find(t => t.id === parseInt(tradeId));

      if (!trade) {
        return { success: false, error: 'Razmena nije pronađena' };
      }

      // Kreiraj scheduled event
      const scheduledEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

      const newEvent = {
        id: Date.now(),
        tradeId: tradeId,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        scheduledDateTime: new Date(`${scheduledDate}T${scheduledTime}`).toISOString(),
        location: location,
        notes: notes,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        participants: [trade.requesterId, trade.ownerId],
        reminders: []
      };

      scheduledEvents.push(newEvent);
      localStorage.setItem('scheduledEvents', JSON.stringify(scheduledEvents));

      // Ažuriraj trade status
      trade.scheduledEventId = newEvent.id;
      localStorage.setItem('trades', JSON.stringify(trades));

      return { success: true, event: newEvent };
    } catch (error) {
      console.error('Greška pri zakazivanju razmene:', error);
      return { success: false, error: 'Greška pri zakazivanju razmene' };
    }
  }

  // Dobavi zakazane razmene za korisnika
  getUserScheduledEvents(userId) {
    try {
      const events = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
      return events.filter(event =>
        event.participants.includes(userId) &&
        event.status !== 'cancelled' &&
        event.status !== 'completed'
      ).sort((a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime));
    } catch (error) {
      console.error('Greška pri čitanju zakazanih razmena:', error);
      return [];
    }
  }

  // Dobavi sve zakazane razmene za određeni dan
  getEventsForDate(userId, date) {
    const events = this.getUserScheduledEvents(userId);
    const targetDate = new Date(date).toDateString();

    return events.filter(event => {
      const eventDate = new Date(event.scheduledDate).toDateString();
      return eventDate === targetDate;
    });
  }

  // Otkaži zakazanu razmenu
  cancelScheduledEvent(eventId, userId) {
    try {
      const events = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
      const event = events.find(e => e.id === parseInt(eventId));

      if (!event) {
        return { success: false, error: 'Zakazana razmena nije pronađena' };
      }

      if (!event.participants.includes(userId)) {
        return { success: false, error: 'Nemate dozvolu da otkažete ovu razmenu' };
      }

      event.status = 'cancelled';
      event.cancelledAt = new Date().toISOString();
      event.cancelledBy = userId;

      localStorage.setItem('scheduledEvents', JSON.stringify(events));

      return { success: true };
    } catch (error) {
      console.error('Greška pri otkazivanju razmene:', error);
      return { success: false, error: 'Greška pri otkazivanju razmene' };
    }
  }

  // Označi razmenu kao završenu
  completeScheduledEvent(eventId) {
    try {
      const events = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
      const event = events.find(e => e.id === parseInt(eventId));

      if (!event) {
        return { success: false, error: 'Zakazana razmena nije pronađena' };
      }

      event.status = 'completed';
      event.completedAt = new Date().toISOString();

      localStorage.setItem('scheduledEvents', JSON.stringify(events));

      // Ažuriraj povezani trade
      const result = dataManager.updateTradeStatus(event.tradeId, 'completed');

      return { success: true, event: event };
    } catch (error) {
      console.error('Greška pri završavanju razmene:', error);
      return { success: false, error: 'Greška pri završavanju razmene' };
    }
  }

  // Dodaj reminder za razmenu
  addReminder(eventId, reminderType, customTime = null) {
    try {
      const events = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
      const event = events.find(e => e.id === parseInt(eventId));

      if (!event) {
        return { success: false, error: 'Zakazana razmena nije pronađena' };
      }

      const scheduledDateTime = new Date(event.scheduledDateTime);
      let reminderDateTime;

      if (customTime) {
        reminderDateTime = new Date(customTime);
      } else {
        const interval = this.reminderIntervals[reminderType];
        reminderDateTime = new Date(scheduledDateTime.getTime() - interval);
      }

      const reminder = {
        id: Date.now(),
        type: reminderType,
        reminderDateTime: reminderDateTime.toISOString(),
        sent: false,
        createdAt: new Date().toISOString()
      };

      if (!event.reminders) {
        event.reminders = [];
      }

      event.reminders.push(reminder);
      localStorage.setItem('scheduledEvents', JSON.stringify(events));

      return { success: true, reminder: reminder };
    } catch (error) {
      console.error('Greška pri dodavanju remindera:', error);
      return { success: false, error: 'Greška pri dodavanju remindera' };
    }
  }

  // Proveri i pošalji due reminders
  checkAndSendReminders(userId) {
    try {
      const events = this.getUserScheduledEvents(userId);
      const now = new Date();
      const dueReminders = [];

      events.forEach(event => {
        if (event.reminders) {
          event.reminders.forEach(reminder => {
            const reminderTime = new Date(reminder.reminderDateTime);
            if (!reminder.sent && reminderTime <= now) {
              dueReminders.push({
                event: event,
                reminder: reminder,
                message: this.generateReminderMessage(event, reminder)
              });

              // Označi kao poslat
              reminder.sent = true;
            }
          });
        }
      });

      if (dueReminders.length > 0) {
        const events = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
        localStorage.setItem('scheduledEvents', JSON.stringify(events));
      }

      return dueReminders;
    } catch (error) {
      console.error('Greška pri proveri remindera:', error);
      return [];
    }
  }

  // Generiši reminder poruku
  generateReminderMessage(event, reminder) {
    const eventDate = new Date(event.scheduledDateTime);
    const formattedDate = eventDate.toLocaleDateString('sr-RS');
    const formattedTime = eventDate.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

    const messages = {
      '1hour': `Podsetnik: Razmena za 1 sat (${formattedTime})`,
      '1day': `Podsetnik: Razmena sutra u ${formattedTime}`,
      '1week': `Podsetnik: Razmena za nedelju dana (${formattedDate})`,
    };

    return messages[reminder.type] || `Podsetnik: Razmena ${formattedDate} u ${formattedTime}`;
  }

  // Kreiranje recurring trade (ponavljajuća razmena)
  createRecurringTrade(tradeData, recurrencePattern) {
    try {
      const recurringTrades = JSON.parse(localStorage.getItem('recurringTrades') || '[]');

      const newRecurringTrade = {
        id: Date.now(),
        ...tradeData,
        recurrencePattern: recurrencePattern, // 'daily', 'weekly', 'monthly'
        startDate: tradeData.startDate || new Date().toISOString(),
        endDate: tradeData.endDate || null,
        active: true,
        createdAt: new Date().toISOString()
      };

      recurringTrades.push(newRecurringTrade);
      localStorage.setItem('recurringTrades', JSON.stringify(recurringTrades));

      // Generiši prvi scheduled event
      this.generateNextRecurringEvent(newRecurringTrade.id);

      return { success: true, recurringTrade: newRecurringTrade };
    } catch (error) {
      console.error('Greška pri kreiranju recurring trade:', error);
      return { success: false, error: 'Greška pri kreiranju ponavljajuće razmene' };
    }
  }

  // Generiši sledeći recurring event
  generateNextRecurringEvent(recurringTradeId) {
    try {
      const recurringTrades = JSON.parse(localStorage.getItem('recurringTrades') || '[]');
      const recurringTrade = recurringTrades.find(rt => rt.id === recurringTradeId);

      if (!recurringTrade || !recurringTrade.active) return null;

      const now = new Date();
      let nextDate = new Date(recurringTrade.lastGeneratedDate || recurringTrade.startDate);

      // Izračunaj sledeći datum na osnovu recurrence pattern-a
      switch (recurringTrade.recurrencePattern) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'biweekly':
          nextDate.setDate(nextDate.getDate() + 14);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        default:
          return null;
      }

      // Proveri da li je prošao end date
      if (recurringTrade.endDate && nextDate > new Date(recurringTrade.endDate)) {
        recurringTrade.active = false;
        localStorage.setItem('recurringTrades', JSON.stringify(recurringTrades));
        return null;
      }

      // Kreiraj scheduled event
      const scheduledEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');

      const newEvent = {
        id: Date.now(),
        tradeId: recurringTrade.tradeId,
        recurringTradeId: recurringTrade.id,
        scheduledDate: nextDate.toISOString().split('T')[0],
        scheduledTime: recurringTrade.preferredTime || '10:00',
        scheduledDateTime: nextDate.toISOString(),
        location: recurringTrade.location,
        notes: 'Automatski generisana ponavljajuća razmena',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        participants: recurringTrade.participants,
        reminders: []
      };

      scheduledEvents.push(newEvent);
      localStorage.setItem('scheduledEvents', JSON.stringify(scheduledEvents));

      // Ažuriraj lastGeneratedDate
      recurringTrade.lastGeneratedDate = nextDate.toISOString();
      localStorage.setItem('recurringTrades', JSON.stringify(recurringTrades));

      return newEvent;
    } catch (error) {
      console.error('Greška pri generisanju recurring event-a:', error);
      return null;
    }
  }

  // Dobavi sve recurring trades za korisnika
  getUserRecurringTrades(userId) {
    try {
      const recurringTrades = JSON.parse(localStorage.getItem('recurringTrades') || '[]');
      return recurringTrades.filter(rt =>
        rt.participants && rt.participants.includes(userId) && rt.active
      );
    } catch (error) {
      console.error('Greška pri čitanju recurring trades:', error);
      return [];
    }
  }

  // Otkaži recurring trade
  cancelRecurringTrade(recurringTradeId, userId) {
    try {
      const recurringTrades = JSON.parse(localStorage.getItem('recurringTrades') || '[]');
      const recurringTrade = recurringTrades.find(rt => rt.id === recurringTradeId);

      if (!recurringTrade) {
        return { success: false, error: 'Ponavljajuća razmena nije pronađena' };
      }

      if (!recurringTrade.participants.includes(userId)) {
        return { success: false, error: 'Nemate dozvolu' };
      }

      recurringTrade.active = false;
      recurringTrade.cancelledAt = new Date().toISOString();
      recurringTrade.cancelledBy = userId;

      localStorage.setItem('recurringTrades', JSON.stringify(recurringTrades));

      return { success: true };
    } catch (error) {
      console.error('Greška pri otkazivanju recurring trade:', error);
      return { success: false, error: 'Greška pri otkazivanju' };
    }
  }

  // Dobavi calendar data za prikaz
  getCalendarData(userId, month, year) {
    const events = this.getUserScheduledEvents(userId);
    const calendar = {};

    events.forEach(event => {
      const eventDate = new Date(event.scheduledDateTime);
      if (eventDate.getMonth() === month && eventDate.getFullYear() === year) {
        const day = eventDate.getDate();
        if (!calendar[day]) {
          calendar[day] = [];
        }
        calendar[day].push(event);
      }
    });

    return calendar;
  }

  // Dobavi statistiku scheduled events
  getSchedulingStats(userId) {
    try {
      const allEvents = JSON.parse(localStorage.getItem('scheduledEvents') || '[]');
      const userEvents = allEvents.filter(e => e.participants.includes(userId));

      return {
        total: userEvents.length,
        upcoming: userEvents.filter(e => e.status === 'scheduled' && new Date(e.scheduledDateTime) > new Date()).length,
        completed: userEvents.filter(e => e.status === 'completed').length,
        cancelled: userEvents.filter(e => e.status === 'cancelled').length,
        recurringActive: this.getUserRecurringTrades(userId).length
      };
    } catch (error) {
      console.error('Greška pri računanju statistike:', error);
      return { total: 0, upcoming: 0, completed: 0, cancelled: 0, recurringActive: 0 };
    }
  }
}

// Inicijalizuj scheduling sistem
const schedulingSystem = new SchedulingSystem();

// Proveri remindere svakih 60 sekundi
setInterval(() => {
  const currentUser = dataManager.getCurrentUser();
  if (currentUser) {
    const dueReminders = schedulingSystem.checkAndSendReminders(currentUser.id);
    if (dueReminders.length > 0) {
      dueReminders.forEach(({ message }) => {
        Toast.info(message);
      });
    }
  }
}, 60000);
