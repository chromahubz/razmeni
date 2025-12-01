# Razmeni Backend API Documentation

Complete API specification for Razmeni backend.

## Base URL
```
Development: http://localhost:3001/api
Production:  https://api.razmeni.rs/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### 🔐 Authentication

#### Register
```http
POST /api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Ime Prezime",
  "city": "Beograd",
  "phone": "+381641234567" // optional
}

Response: 201 Created
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "Ime Prezime",
    "city": "Beograd",
    "trustScore": 0,
    "createdAt": "2025-12-01T10:00:00Z"
  }
}
```

#### Login
```http
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "user": { ... }
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password

Body:
{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "Reset link sent to email"
}
```

#### Reset Password
```http
POST /api/auth/reset-password

Body:
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}

Response: 200 OK
{
  "message": "Password reset successful"
}
```

---

### 📝 Listings

#### Get All Listings
```http
GET /api/listings?page=1&limit=20&category=Voće&city=Beograd&search=jabuke

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- category: string (optional)
- city: string (optional)
- search: string (optional)
- condition: string (optional)
- sortBy: createdAt|title (default: createdAt)
- order: asc|desc (default: desc)

Response: 200 OK
{
  "listings": [
    {
      "id": "listing_id",
      "title": "Sveže jabuke",
      "description": "Organske jabuke...",
      "category": "Voće",
      "condition": "Novo",
      "imageUrl": "https://cloudinary.com/...",
      "city": "Beograd",
      "status": "active",
      "createdAt": "2025-12-01T10:00:00Z",
      "user": {
        "id": "user_id",
        "fullName": "Ime Prezime",
        "trustScore": 85
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Get Single Listing
```http
GET /api/listings/:id

Response: 200 OK
{
  "listing": {
    "id": "listing_id",
    "title": "Sveže jabuke",
    "description": "Detaljno...",
    "category": "Voće",
    "condition": "Novo",
    "imageUrl": "https://...",
    "city": "Beograd",
    "status": "active",
    "createdAt": "2025-12-01T10:00:00Z",
    "user": {
      "id": "user_id",
      "fullName": "Ime Prezime",
      "email": "user@example.com", // only if own listing
      "phone": "+381...", // only if own listing
      "trustScore": 85,
      "totalRatings": 12,
      "averageRating": 4.5
    }
  }
}
```

#### Create Listing
```http
POST /api/listings
Headers: Authorization: Bearer <token>

Body:
{
  "title": "Sveže jabuke",
  "description": "Organske jabuke iz moje bašte",
  "category": "Voće",
  "condition": "Novo",
  "imageUrl": "https://cloudinary.com/...", // from upload endpoint
  "city": "Beograd"
}

Response: 201 Created
{
  "listing": { ... }
}
```

#### Update Listing
```http
PUT /api/listings/:id
Headers: Authorization: Bearer <token>

Body:
{
  "title": "Updated title",
  "description": "Updated description",
  ...
}

Response: 200 OK
{
  "listing": { ... }
}
```

#### Delete Listing
```http
DELETE /api/listings/:id
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Listing deleted successfully"
}
```

#### Get My Listings
```http
GET /api/listings/my-listings
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "listings": [ ... ]
}
```

---

### 🔄 Trades

#### Get My Trades
```http
GET /api/trades?status=pending&type=received
Headers: Authorization: Bearer <token>

Query Parameters:
- status: pending|accepted|declined|completed (optional)
- type: sent|received (optional)

Response: 200 OK
{
  "trades": [
    {
      "id": "trade_id",
      "status": "pending",
      "createdAt": "2025-12-01T10:00:00Z",
      "offerer": {
        "id": "user_id",
        "fullName": "Ime Prezime",
        "trustScore": 85
      },
      "receiver": { ... },
      "offeredListing": {
        "id": "listing_id",
        "title": "Moje jabuke",
        "imageUrl": "..."
      },
      "requestedListing": {
        "id": "listing_id",
        "title": "Tvoje kruške",
        "imageUrl": "..."
      }
    }
  ]
}
```

#### Propose Trade
```http
POST /api/trades
Headers: Authorization: Bearer <token>

Body:
{
  "offeredListingId": "my_listing_id",
  "requestedListingId": "their_listing_id"
}

Response: 201 Created
{
  "trade": { ... }
}
```

#### Accept Trade
```http
PUT /api/trades/:id/accept
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "trade": {
    "id": "trade_id",
    "status": "accepted",
    ...
  }
}
```

#### Decline Trade
```http
PUT /api/trades/:id/decline
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "trade": {
    "id": "trade_id",
    "status": "declined",
    ...
  }
}
```

#### Complete Trade
```http
PUT /api/trades/:id/complete
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "trade": {
    "id": "trade_id",
    "status": "completed",
    "completedAt": "2025-12-01T12:00:00Z",
    ...
  }
}
```

---

### 💬 Messages

#### Get Conversations
```http
GET /api/messages/conversations
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "conversations": [
    {
      "trade": {
        "id": "trade_id",
        "offerer": { ... },
        "receiver": { ... },
        "offeredListing": { ... },
        "requestedListing": { ... }
      },
      "lastMessage": {
        "id": "message_id",
        "content": "Poslednja poruka...",
        "senderId": "user_id",
        "createdAt": "2025-12-01T11:00:00Z",
        "read": false
      },
      "unreadCount": 3
    }
  ]
}
```

#### Get Messages for Trade
```http
GET /api/messages/:tradeId
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "messages": [
    {
      "id": "message_id",
      "content": "Poruka tekst",
      "senderId": "user_id",
      "sender": {
        "id": "user_id",
        "fullName": "Ime Prezime"
      },
      "read": true,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ]
}
```

#### Send Message
```http
POST /api/messages
Headers: Authorization: Bearer <token>

Body:
{
  "tradeId": "trade_id",
  "content": "Tekst poruke"
}

Response: 201 Created
{
  "message": { ... }
}
```

#### Mark Message as Read
```http
PUT /api/messages/:id/read
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Marked as read"
}
```

---

### 👤 Users

#### Get User Profile
```http
GET /api/users/:id

Response: 200 OK
{
  "user": {
    "id": "user_id",
    "fullName": "Ime Prezime",
    "city": "Beograd",
    "bio": "Moja biografija...",
    "avatar": "https://...",
    "trustScore": 85,
    "totalRatings": 12,
    "averageRating": 4.5,
    "memberSince": "2025-01-01T00:00:00Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/:id
Headers: Authorization: Bearer <token>

Body:
{
  "fullName": "Novo Ime",
  "city": "Novi Sad",
  "phone": "+381...",
  "bio": "Nova biografija",
  "avatar": "https://cloudinary.com/..."
}

Response: 200 OK
{
  "user": { ... }
}
```

#### Get User Ratings
```http
GET /api/users/:id/ratings

Response: 200 OK
{
  "ratings": [
    {
      "id": "rating_id",
      "rating": 5,
      "comment": "Odlična razmena!",
      "fromUser": {
        "id": "user_id",
        "fullName": "Ime Prezime"
      },
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ],
  "summary": {
    "average": 4.5,
    "total": 12,
    "distribution": {
      "5": 8,
      "4": 3,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

---

### ⭐ Ratings

#### Rate User After Trade
```http
POST /api/ratings
Headers: Authorization: Bearer <token>

Body:
{
  "tradeId": "trade_id",
  "rating": 5,
  "comment": "Odlična razmena, sve preporuke!"
}

Response: 201 Created
{
  "rating": {
    "id": "rating_id",
    "rating": 5,
    "comment": "...",
    "createdAt": "2025-12-01T12:00:00Z"
  }
}
```

---

### ❤️ Favorites

#### Get My Favorites
```http
GET /api/favorites
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "favorites": [
    {
      "id": "favorite_id",
      "listing": {
        "id": "listing_id",
        "title": "Sveže jabuke",
        "imageUrl": "...",
        "city": "Beograd",
        "user": { ... }
      },
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ]
}
```

#### Add to Favorites
```http
POST /api/favorites/:listingId
Headers: Authorization: Bearer <token>

Response: 201 Created
{
  "favorite": { ... }
}
```

#### Remove from Favorites
```http
DELETE /api/favorites/:listingId
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Removed from favorites"
}
```

---

### 📤 File Upload

#### Upload Image
```http
POST /api/upload
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body (Form Data):
  image: <file>

Response: 200 OK
{
  "url": "https://res.cloudinary.com/..../image.jpg"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "details": { ... } // optional
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Validation Error - Invalid data format |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 10 requests per hour per user

---

## WebSocket Events (Real-time)

### Connect
```javascript
const socket = io('https://api.razmeni.rs', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Events

#### Join Trade Room
```javascript
socket.emit('join-trade', { tradeId: 'trade_id' });
```

#### Send Message
```javascript
socket.emit('send-message', {
  tradeId: 'trade_id',
  content: 'Poruka tekst'
});
```

#### Receive Message
```javascript
socket.on('new-message', (message) => {
  console.log('New message:', message);
});
```

#### User Online Status
```javascript
socket.on('user-online', (userId) => {
  console.log('User online:', userId);
});

socket.on('user-offline', (userId) => {
  console.log('User offline:', userId);
});
```

---

## Testing

### Example cURL Requests

```bash
# Register
curl -X POST https://api.razmeni.rs/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","city":"Beograd"}'

# Login
curl -X POST https://api.razmeni.rs/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Listings (with auth)
curl -X GET https://api.razmeni.rs/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Postman Collection

Import this URL in Postman:
```
https://api.razmeni.rs/postman-collection.json
```

(To be created)

---

**Version**: 1.0.0
**Last Updated**: 2025-12-01
**Status**: Specification Complete, Implementation Pending
