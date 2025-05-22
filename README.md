# Xero Demo App

A full-stack application for managing Xero invoices and bills, built with React and Express.js.

## Overview

This project consists of two main parts:

- A React frontend for the user interface
- An Express.js backend for Xero API integration

## Project Structure

```
xero-demo-app/
├── client/          # React frontend application
│   ├── src/         
│   ├── public/      
│   └── README.md    # Frontend documentation
├── server/          # Express.js backend application
│   ├── src/         
│   └── README.md    # Backend documentation
└── README.md        
```

## Features

- OAuth2 authentication with Xero
- View and manage sales invoices
- View and manage supplier bills
- Detailed invoice/bill views
- Filter invoices by type and status
- Secure session handling
- RESTful API endpoints

## Tech Stack

### Frontend

- React 18
- React Router DOM 7
- Vite
- Tailwind CSS
- shadcn/ui components
- Axios

### Backend

- Node.js
- Express.js
- xero-node SDK
- JWT handling
- Express Session

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/MayricoAK/Xero-Demo.git
cd xero-demo-app
```

2. Set up the backend:

```bash
cd server
npm install
cp .env.example .env
# Update .env with your Xero API credentials
npm run dev
```

3. Set up the frontend:

```bash
cd ../client
npm install
cp .env.example .env.local
npm run dev
```

4. Open your browser and navigate to:

- Frontend: http://localhost:5173
- Backend: http://localhost:3051

## Documentation

- [Frontend Documentation](./client/README.md)
- [Backend Documentation](./server/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
