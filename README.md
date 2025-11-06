# Product Listing API

A RESTful API built with TypeScript, Express, and MongoDB for product listing, authentication, and shopping cart management.

## Features

- User authentication with JWT
- Product CRUD operations
- Shopping cart with user-specific persistence
- Product pagination
- Category filtering
- Product search
- Image support for products

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
└── server.ts        # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-listing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products (supports pagination, category filter, search)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a product (requires authentication)
- `PUT /api/products/:id` - Update a product (requires authentication)
- `DELETE /api/products/:id` - Delete a product (requires authentication)

### Cart

- `GET /api/cart` - Get user's cart (requires authentication)
- `POST /api/cart` - Add item to cart (requires authentication)
- `PUT /api/cart/:productId` - Update cart item quantity (requires authentication)
- `DELETE /api/cart/:productId` - Remove item from cart (requires authentication)
- `DELETE /api/cart` - Clear cart (requires authentication)

## Query Parameters

### Products

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `search` - Search in product name and description

## Request/Response Examples

### Register User

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response includes a JWT token in the response body.

### Create Product

```json
POST /api/products
Headers: Authorization: Bearer <token>
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Get Products with Pagination

```
GET /api/products?page=1&limit=10&category=Electronics&search=laptop
```

## Deployment

### Heroku

1. Create a Heroku app:

```bash
heroku create your-app-name
```

2. Set environment variables:

```bash
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
```

3. Deploy:

```bash
git push heroku main
```

### AWS (Elastic Beanstalk)

1. Install EB CLI
2. Initialize EB:

```bash
eb init
```

3. Create environment:

```bash
eb create your-env-name
```

4. Set environment variables in AWS Console or via CLI:

```bash
eb setenv MONGODB_URI=your-mongodb-uri JWT_SECRET=your-jwt-secret NODE_ENV=production
```

5. Deploy:

```bash
eb deploy
```

### DigitalOcean (App Platform)

1. Connect your repository to DigitalOcean App Platform
2. Configure build command: `npm run build`
3. Configure run command: `npm start`
4. Set environment variables in the App Platform dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### MongoDB Hosting

For production, use MongoDB Atlas (cloud-hosted MongoDB):

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

## Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## License

ISC
