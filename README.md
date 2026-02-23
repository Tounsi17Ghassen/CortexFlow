# CortexFlow

A comprehensive all-in-one workspace platform combining note-taking, project management, databases, and collaboration features built on a block-based architecture.

## Features

- **Block-based Editor** - Rich text editing with support for various block types (text, headings, lists, code, images, etc.)
- **Workspaces** - Organize your work into separate workspaces
- **Pages** - Create and manage pages within workspaces
- **Real-time Collaboration** - Work together with your team in real-time
- **Database Views** - View and manage structured data in table, board, and calendar views
- **Authentication** - Secure JWT-based authentication system
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **PostgreSQL** - Primary database
- **Prisma** - ORM for database management
- **JWT** - Authentication tokens
- **Passport.js** - Authentication middleware
- **Socket.io** - Real-time communication

### Frontend
- **React** with **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Project Structure

```
CortexFlow/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files (passport, etc.)
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state stores
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── main.tsx        # Entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/cortexflow"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and proxies API calls to the backend on port 5000.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Workspaces
- `GET /api/workspaces` - List all workspaces for the current user
- `POST /api/workspaces` - Create a new workspace
- `GET /api/workspaces/:id` - Get workspace details
- `GET /api/workspaces/:id/pages` - List pages in a workspace

### Pages
- `GET /api/pages/:id` - Get page by ID
- `POST /api/pages` - Create a new page
- `PUT /api/pages/:id` - Update a page
- `DELETE /api/pages/:id` - Delete a page

### Blocks
- `GET /api/blocks/:pageId` - Get all blocks for a page
- `POST /api/blocks` - Create a new block
- `PUT /api/blocks/:id` - Update a block
- `DELETE /api/blocks/:id` - Delete a block

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
