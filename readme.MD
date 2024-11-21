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
   ```sh
   cp .env.example .env
   ```
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

- POST /api/login
- POST /api/register
- POST /api/logout
- POST /api/refresh-token
- GET /api/me
- POST /api/change-password
- POST /api/update-profile

### Blogs

- POST /api/blog
- GET /api/blogs
- GET /api/blog/:id
- PUT /api/blog/:id
- DELETE /api/blog/:id
- GET /api/blogs/slug/:slug
- POST /api/blogs/:id/restore
- GET /api/blogs-trashed
- DELETE /api/blogs/:id/force-delete
- GET /api/blogs/tag/:tag
- GET /api/blogs/category/:id

### Users

- GET /api/users
- GET /api/user/:id
- PUT /api/user/:id
- DELETE /api/user/:id
- POST /api/user/:id/restore
- DELETE /api/user/:id/force-delete
- GET /api/users-trashed

### Categories

- GET /api/categories
- POST /api/category
- GET /api/category/:id
- PUT /api/category/:id
- DELETE /api/category/:id
- POST /api/category/:id/restore
- DELETE /api/category/:id/force-delete
- GET /api/category/slug/:slug
- GET /api/categories-trashed

### Tags

- GET /api/tags
- POST /api/tag
- GET /api/tag/:id
- PUT /api/tag/:id
- DELETE /api/tag/:id
- POST /api/tag/:id/restore
- DELETE /api/tag/:id/force-delete
- GET /api/tag/slug/:slug
- GET /api/tags-trashed

## Settings

- GET /api/settings
- GET /api/settings-public
- GET /api/settings-private
- POST /api/settings
- GET /api/settings/:key
- GET /api/settings-public/:key
- GET /api/settings-private/:key
- PUT /api/settings/:key
- DELETE /api/settings/:key

### Contacts

- GET /api/contacts
- POST /api/contact
- GET /api/contact/:id
- PUT /api/contact/:id
- DELETE /api/contact/:id
- POST /api/contact/:id/restore
- DELETE /api/contact/:id/force-delete
- GET /api/contacts-trashed

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
