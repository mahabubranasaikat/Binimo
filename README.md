# Binimoi

A local buy-and-sell marketplace platform.

## Features

- Browse products without login
- User authentication with JWT
- Product listings with admin approval
- Chat feature for buyers and sellers
- Admin dashboard

## Tech Stack

- Backend: Node.js, Express, MySQL
- Frontend: HTML, CSS, JS
- Authentication: JWT
- File Storage: Local (can be upgraded to AWS S3)

## Setup

1. Clone the repository
2. Set up MySQL database and run schema.sql
3. Install backend dependencies: `cd backend && npm install`
4. Create a `.env` file in the backend directory with your database and JWT secret configurations
5. Start backend: `cd backend && node server.js`
6. Open frontend/index.html in browser