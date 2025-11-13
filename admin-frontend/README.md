# Admin Frontend

Admin dashboard for CrockList built with React, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

- Login page (no backend integration yet)
- Admin dashboard with statistics cards
- Clean and simple design matching the main frontend
- TypeScript for type safety
- Tailwind CSS for styling

## Project Structure

```
admin-frontend/
├── src/
│   ├── components/
│   │   └── Navbar.tsx      # Navigation bar with Admin CrockList logo
│   ├── pages/
│   │   ├── Login.tsx       # Admin login page
│   │   └── AdminDashboard.tsx  # Main admin dashboard
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind CSS imports
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

