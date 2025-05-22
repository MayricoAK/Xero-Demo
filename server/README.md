# Xero Demo App - Server

Express.js backend server for the Xero Demo application, handling OAuth2 authentication and Xero API integration.

## Features

- OAuth2 authentication with Xero
- Express.js REST API
- Invoice and bill management
- Session handling
- Security middleware

## Tech Stack

- Node.js
- Express.js
- xero-node SDK
- JWT handling
- Express Session

## Project Structure

```

server/
├── src/
│ ├── config/ # Configuration files
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Express middleware
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ └── app.js # Express app setup
└── index.js # Server entry point

```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```
PORT=3051
XERO_CLIENT_ID=your_client_id
XERO_CLIENT_SECRET=your_client_secret
XERO_REDIRECT_URI=http://localhost:3051/api/callback
SESSION_SECRET=your_session_secret
```

3. Start development server:

```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Dependencies

- express - Web framework
- xero-node - Official Xero SDK
- cors - Cross-origin resource sharing
- express-session - Session middleware
- helmet - Security middleware
- jwt-decode - JWT token handling
- morgan - HTTP request logger

## API Routes

- `GET /api/xero/connect` - Connect Xero OAuth2
- `GET /api/xero/callback` - OAuth2 callback handler
- `GET /api/xero/invoices` - Get invoices with filters
- `GET /api/xero/invoices/:id` - Get invoice by ID
- `POST /api/xero/logout` - Remove Xero session
