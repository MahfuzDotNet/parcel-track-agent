# Courier Management System - Backend API

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Parcels
- `GET /api/parcels` - Get all parcels (admin only)
- `GET /api/parcels/track/:trackingNumber` - Track parcel
- `GET /api/parcels/my-parcels` - Get user's parcels
- `POST /api/parcels` - Create new parcel
- `PATCH /api/parcels/:id/status` - Update parcel status
- `PATCH /api/parcels/:id/assign` - Assign agent (admin only)

### Agents
- `GET /api/agents` - Get all agents (admin only)
- `GET /api/agents/my-parcels` - Get agent's parcels
- `PATCH /api/agents/parcels/:id/location` - Update parcel location

### Analytics
- `GET /api/analytics/bookings` - Booking analytics (admin only)
- `GET /api/analytics/performance` - Delivery performance (admin only)

## Default Users
- Admin: admin@courier.com / admin123
- Agent: agent@courier.com / agent123  
- Customer: customer@courier.com / customer123