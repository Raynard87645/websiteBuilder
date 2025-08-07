# 🚀 Real-time Chat Application

A modern, scalable real-time chat application built with Node.js, React, TypeScript, PostgreSQL, Redis, and Socket.IO.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- Secure password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS protection

### 💬 Real-time Messaging
- Instant message delivery with Socket.IO
- Private and group chat rooms
- Message persistence with PostgreSQL
- Real-time user presence indicators
- Typing indicators
- Message history and pagination

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Beautiful, intuitive interface
- Dark/light theme support
- Real-time updates without page refresh
- Smooth animations and transitions

### 🏗️ Architecture
- Modular backend architecture
- RESTful API design
- Real-time communication with WebSockets
- Redis pub/sub for multi-instance support
- State management with Zustand
- TypeScript for type safety

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Redis** - Caching and pub/sub
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication
- **React Hook Form** - Form handling

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **PostgreSQL** - Database
- **Redis** - Caching and message broker

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd chat-app
\`\`\`

### 2. Environment Setup
Copy environment files and update with your settings:

\`\`\`bash
# Backend environment
cp server/.env.example server/.env

# Frontend environment (optional)
cp client/.env.example client/.env
\`\`\`

### 3. Docker Deployment (Recommended)
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Nginx (reverse proxy): http://localhost:80

### 4. Local Development

#### Backend Setup
\`\`\`bash
cd server
npm install
npm run migrate  # Run database migrations
npm run dev      # Start development server
\`\`\`

#### Frontend Setup
\`\`\`bash
cd client
npm install
npm run dev      # Start development server
\`\`\`

## 📂 Project Structure

\`\`\`
chat-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and socket services
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend container
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # Socket.IO handlers
│   │   └── types/         # TypeScript types
│   ├── tests/             # Test files
│   └── Dockerfile         # Backend container
├── infra/                 # Infrastructure configuration
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml     # Multi-container setup
└── README.md
\`\`\`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
\`\`\`env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatapp
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
\`\`\`

#### Frontend (.env)
\`\`\`env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
\`\`\`

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd server
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
\`\`\`

### API Testing
Use the included API collection for testing endpoints:
- Authentication (login, register, refresh)
- Chat rooms (create, join, leave)
- Messages (send, fetch, delete)

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Chat Endpoints
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create new chat room
- `POST /api/chat/rooms/private` - Create private chat
- `GET /api/chat/rooms/:id/messages` - Get room messages
- `POST /api/chat/rooms/:id/messages` - Send message
- `GET /api/chat/users/search` - Search users

### Socket.IO Events
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `new_message` - Receive new message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

## 🚀 Deployment

### Docker Production Deployment
\`\`\`bash
# Build and start services
docker-compose -f docker-compose.yml up -d

# Scale services
docker-compose up -d --scale backend=3

# Update services
docker-compose pull
docker-compose up -d
\`\`\`

### Manual Deployment
1. Set up PostgreSQL and Redis servers
2. Configure environment variables
3. Build and deploy backend
4. Build and deploy frontend
5. Configure reverse proxy (Nginx)

## 🔒 Security Considerations

- Use strong JWT secrets in production
- Configure CORS properly
- Set up HTTPS with SSL certificates
- Use environment variables for sensitive data
- Implement rate limiting
- Regular security updates
- Database connection encryption

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- PostgreSQL for reliable data storage
- Redis for caching and pub/sub
- React and TypeScript communities
- All contributors and testers