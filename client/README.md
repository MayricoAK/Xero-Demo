# Xero Demo App - Client

A React-based frontend application for managing Xero invoices and bills.

## Features

- Authentication with Xero OAuth2
- View and manage sales invoices
- View and manage supplier bills
- Detailed invoice/bill views
- Filter invoices by type and status

## Tech Stack

- React 18
- React Router DOM 7
- Vite
- Tailwind CSS
- shadcn/ui components
- Axios for API calls

## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/           # Utility functions and helpers
│   ├── pages/         # Page components
│   └── utils/         # Shared utilities
├── public/            # Static assets
└── ...config files
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` or `.env` file:
```
//Replace with your actual backend URL
VITE_API_URL="http://localhost:3051" 
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build