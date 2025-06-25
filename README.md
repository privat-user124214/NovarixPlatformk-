# Novarix Studio - Discord Bot Development Platform

A modern full-stack web application for managing Discord bot development orders and customer relationships.

## 🚀 Features

- **Customer Portal**: Users can place orders for custom Discord bots
- **Team Management**: Role-based access control (customer, dev, admin, owner)
- **Order Tracking**: Complete order lifecycle management
- **Partner System**: Public partnerships display with management interface
- **Mobile Responsive**: Optimized for all devices
- **Dark Theme**: Custom Novarix branding

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Wouter (routing)
- TanStack Query (state management)
- shadcn/ui + Radix UI (components)
- Tailwind CSS (styling)
- Vite (build tool)

### Backend
- Express.js + TypeScript
- JSON file storage
- Session-based authentication
- bcrypt password hashing

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Responsive navigation
- Mobile-optimized forms
- Adaptive layouts

## 🚀 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Use the included `render.yaml` configuration
3. Set environment variables:
   - `SESSION_SECRET`

### Other Platforms
- **Vercel**: Use `vercel.json` configuration
- **Netlify**: Use `netlify.toml` configuration
- **Docker**: Use included `Dockerfile`

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Environment Variables

```env
SESSION_SECRET=your_session_secret_key
NODE_ENV=production
PORT=5000
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── jsonStorage.ts      # JSON file storage
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
├── data/                   # JSON data files
└── dist/                   # Build output
```

## 🔐 Security Features

- Session-based authentication
- Password hashing with bcrypt
- Role-based access control
- CSRF protection
- Secure session management
- JSON file-based data persistence

## 📄 License

MIT License