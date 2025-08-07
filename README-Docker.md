# Docker Setup for Avara Project

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Project Structure

The project consists of:
- **Backend**: Medusa e-commerce backend (Node.js)
- **Storefront**: Next.js frontend application
- **Database**: PostgreSQL database
- **Cache**: Redis for caching and sessions

## Quick Start

### Development Environment

1. **Clone and navigate to the project directory:**
   ```bash
   cd /path/to/your/avara/project
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications:**
   - Backend API: http://localhost:9000
   - Storefront: http://localhost:8000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### Production Environment

1. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret_key
   COOKIE_SECRET=your_cookie_secret_key
   STORE_CORS=https://yourdomain.com
   ADMIN_CORS=https://admin.yourdomain.com
   AUTH_CORS=https://yourdomain.com
   ```

2. **Start production services:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Docker Commands

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f storefront

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Access container shell
docker-compose exec backend sh
docker-compose exec storefront sh
docker-compose exec postgres psql -U avara -d avara
```

### Production

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down

# Rebuild production services
docker-compose -f docker-compose.prod.yml up -d --build
```

## Database Management

### Initialize Database

After starting the services, you may need to run database migrations:

```bash
# Access backend container
docker-compose exec backend sh

# Run migrations (if needed)
npm run build
# or use Medusa CLI commands as needed
```

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U avara avara > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U avara avara < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure ports 9000, 8000, 5432, and 6379 are not in use
   - Modify ports in docker-compose.yml if needed

2. **Database connection issues:**
   - Wait for PostgreSQL to be healthy before starting backend
   - Check database credentials in environment variables

3. **Build failures:**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild images: `docker-compose build --no-cache`

4. **Permission issues:**
   - Ensure Docker has proper permissions
   - Run with sudo if needed (Linux/macOS)

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs storefront
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f

# Check container status
docker-compose ps
```

## Environment Variables

### Development
- `DATABASE_URL`: PostgreSQL connection string
- `STORE_CORS`: CORS settings for storefront
- `ADMIN_CORS`: CORS settings for admin
- `AUTH_CORS`: CORS settings for authentication
- `JWT_SECRET`: JWT signing secret
- `COOKIE_SECRET`: Cookie encryption secret