# Serverless Project (Frontend)

### Run the development server:

```
cd frontend
npm run dev
```

### Check code with ESLint:

```
npx eslint <path>
```

(Replace <path> with the folder or file you want to lint. e.g. `src/`)
For example:

```
npx eslint src/
```

# File structure

```
.
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── public
├── README.md
├── src
│   ├── App.jsx             # Root React component, entry point for the component tree
│   ├── components          # Reusable UI components (buttons, cards, modals, etc.)
│   ├── context             # React context providers for global state management
│   ├── hooks               # Custom React hooks for reusable logic
│   ├── index.css
│   ├── main.jsx
│   ├── pages               # Page-level components for routing (Home, Login, Profile, etc.)
│   ├── services            # API calls, data fetching, and business logic services
│   └── utils               # Helper functions used across app
├── tailwind.config.js
└── vite.config.js
```
