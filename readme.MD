# 🚀 Blog App with Node.js

## 🌟 Overview

A powerful blog application built with Node.js, Express, and MongoDB, featuring robust user authentication, role-based authorization, and comprehensive blog management.

## 📦 Repository

```sh
git clone https://github.com/anisAronno/blog-with-node-and-mongodb.git
```

## ✨ Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- CRUD blog functionality
- Pagination and filtering
- Error handling and logging
- API documentation

## 🗂️ Project Structure

```
.
├── .env
├── .env.example
├── .gitignore
├── app.js
├── docs/
│   └── Blog App with Node JS.postman_collection.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── errors/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
└── package.json
```

## 🛠️ Setup

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create `.env` file (use `.env.example` as template)
   `sh
    cp .env.example .env
    `
4. Start the application:
   ```sh
   npm run dev
   ```
5. Run Application For Development
   ```sh
   npm run watch
   ```

## 🔐 Key Endpoints

### Authentication

- POST `/api/login`
- POST `/api/register`
- POST `/api/logout`
- POST `/api/refresh-token`
- GET `/api/me`
- POST `/api/change-password`
- POST `/api/update-profile`

### Blogs

- POST `/api/blog`
- GET `/api/blogs`
- GET `/api/blog/:id`
- PUT `/api/blog/:id`
- DELETE `/api/blog/:id`

### Users

- GET `/api/users`
- GET `/api/user/:id`
- PUT `/api/user/:id`
- DELETE `/api/user/:id`

## 📖 API Documentation

Refer to `docs/Blog App with Node JS.postman_collection.json`

## 📄 License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

### Key License Terms

- Full source code must be made available
- Modifications must be released under the same license
- Commercial use is permitted
- Provides strong copyleft protections
- Ensures user freedoms to use, study, share, and modify the software
