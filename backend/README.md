# AI Sales Roleplay Platform - Backend API

Node.js/Express backend server with PostgreSQL database that can be hosted on AWS EC2, ECS, Lambda, or any other server.

## Features

- RESTful API with Express
- PostgreSQL database
- JWT authentication with bcrypt password hashing
- Role-based access control (Sales Rep, Manager, Admin)
- Comprehensive call analytics and scoring system
- Rate limiting and security middleware

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL (via pg driver)
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=3000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=sales_roleplay
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

3. Create PostgreSQL database:
```bash
createdb sales_roleplay
```

4. Run migrations:
```bash
npm run build
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Bots
- `GET /api/bots` - Get all active bots
- `GET /api/bots/:id` - Get bot by ID
- `POST /api/bots` - Create bot (manager/admin only)
- `PUT /api/bots/:id` - Update bot (manager/admin only)
- `DELETE /api/bots/:id` - Soft delete bot (manager/admin only)

### Calls
- `POST /api/calls` - Create new call session
- `GET /api/calls` - Get all call sessions
- `GET /api/calls/:id` - Get call session by ID
- `PUT /api/calls/:id/end` - End call session
- `POST /api/calls/transcript` - Add transcript entry
- `GET /api/calls/:session_id/transcript` - Get call transcript

### Analytics
- `POST /api/analytics` - Create analytics record
- `GET /api/analytics/session/:session_id` - Get analytics by session
- `GET /api/analytics/criteria` - Get scoring criteria
- `POST /api/analytics/scores` - Create/update call score
- `GET /api/analytics/scores/:session_id` - Get all scores for session

## Deployment Options

### Option 1: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04 LTS recommended)
2. Install Node.js and PostgreSQL:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib
```

3. Clone your repository and install:
```bash
git clone your-repo-url
cd backend
npm install
npm run build
```

4. Set up environment variables in `.env`

5. Run migrations:
```bash
npm run migrate
```

6. Install PM2 for process management:
```bash
sudo npm install -g pm2
pm2 start dist/server.js --name sales-api
pm2 startup
pm2 save
```

7. Configure nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: AWS ECS (Docker)

1. Create Dockerfile:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

2. Build and push to ECR:
```bash
docker build -t sales-api .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-ecr-url
docker tag sales-api:latest your-ecr-url/sales-api:latest
docker push your-ecr-url/sales-api:latest
```

3. Create ECS task definition and service

### Option 3: AWS RDS for Database

Instead of running PostgreSQL on EC2, use AWS RDS:

1. Create RDS PostgreSQL instance
2. Update `.env` with RDS endpoint:
```
DATABASE_HOST=your-rds-endpoint.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=sales_roleplay
DATABASE_USER=postgres
DATABASE_PASSWORD=your_rds_password
```

### Option 4: AWS Lambda + API Gateway (Serverless)

For serverless deployment, you'll need to adapt the Express app using `serverless-http` or AWS SAM.

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all sensitive data
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up database backups
- [ ] Enable database SSL connection
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting appropriately
- [ ] Set up health checks and auto-restart

## Database Schema

The database includes:
- `users` - User accounts with roles
- `bots` - AI personas for roleplay
- `call_sessions` - Call records
- `call_transcripts` - Conversation history
- `call_analytics` - Performance metrics
- `scoring_criteria` - Evaluation criteria (10 default)
- `call_scores` - Detailed scores with transcript evidence

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- SQL injection prevention via parameterized queries
- CORS configuration

## Development

Build TypeScript:
```bash
npm run build
```

Watch mode for development:
```bash
npm run dev
```

## Support

For issues or questions, please refer to the main project documentation.
