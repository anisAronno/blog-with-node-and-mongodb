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
- Full CRUD functionality for blogs, users, categories, tags, and settings
- Soft delete and restore for key resources
- Pagination and filtering
- Error handling and logging
- Modular architecture
- Comprehensive API documentation

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
│   ├── transformations/
│   ├── utils/
│   └── validation/
└── package.json

```

## 🛠️ Setup

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create `.env` file (use `.env.example` as a template):
   ```sh
   cp .env.example .env
   ```
4. Start the application:
   ```sh
   npm run dev
   ```
5. For Development:
   ```sh
   npm run watch
   ```

---

## 🔐 Key Endpoints

### Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/login`         | User login                  |
| POST   | `/api/register`      | User registration           |
| POST   | `/api/logout`        | User logout                 |
| POST   | `/api/refresh-token` | Refresh access token        |
| GET    | `/api/me`            | Get current user profile    |
| PUT    | `/api/me`            | Update current user profile |
| PUT    | `/api/me/password`   | Change password             |

### Blogs

| Method | Endpoint                           | Description                |
| ------ | ---------------------------------- | -------------------------- |
| GET    | `/api/v1/blogs`                    | List all blogs             |
| POST   | `/api/v1/blogs`                    | Create a blog              |
| GET    | `/api/v1/blogs/:id`                | Get blog details by ID     |
| PUT    | `/api/v1/blogs/:id`                | Update a blog by ID        |
| DELETE | `/api/v1/blogs/:id`                | Soft delete a blog by ID   |
| POST   | `/api/v1/blogs/:id/restore`        | Restore a deleted blog     |
| DELETE | `/api/v1/blogs/:id/permanent`      | Permanently delete a blog  |
| GET    | `/api/v1/blogs/trash`              | List trashed blogs         |
| GET    | `/api/v1/blogs/slug/:slug`         | Get blog details by slug   |
| GET    | `/api/v1/blogs/published`          | List published blogs       |
| GET    | `/api/v1/blogs/user/me`            | List blogs by current user |
| GET    | `/api/v1/blogs/user/:id/published` | List blogs by user ID      |
| GET    | `/api/v1/blogs/tag/:id`            | List blogs by tag ID       |
| GET    | `/api/v1/blogs/category/:id`       | List blogs by category ID  |

### Users

| Method | Endpoint                      | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/api/v1/users`               | List all users               |
| POST   | `/api/v1/users`               | Create a new user            |
| GET    | `/api/v1/users/:id`           | Get user details by ID       |
| PUT    | `/api/v1/users/:id`           | Update user by ID            |
| DELETE | `/api/v1/users/:id`           | Soft delete user by ID       |
| POST   | `/api/v1/users/:id/restore`   | Restore a deleted user       |
| DELETE | `/api/v1/users/:id/permanent` | Permanently delete user      |
| GET    | `/api/v1/users/trash`         | List trashed users           |
| GET    | `/api/v1/users/me`            | Get current user profile     |
| PUT    | `/api/v1/users/me`            | Update current user profile  |
| PUT    | `/api/v1/users/me/password`   | Change current user password |

### Categories

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| GET    | `/api/v1/categories`               | List all categories         |
| POST   | `/api/v1/categories`               | Create a category           |
| GET    | `/api/v1/categories/:id`           | Get category details by ID  |
| PUT    | `/api/v1/categories/:id`           | Update category by ID       |
| DELETE | `/api/v1/categories/:id`           | Soft delete category by ID  |
| POST   | `/api/v1/categories/:id/restore`   | Restore a deleted category  |
| DELETE | `/api/v1/categories/:id/permanent` | Permanently delete category |
| GET    | `/api/v1/categories/trash`         | List trashed categories     |
| GET    | `/api/v1/categories/slug/:slug`    | Get category by slug        |

### Tags

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/api/v1/tags`               | List all tags          |
| POST   | `/api/v1/tags`               | Create a tag           |
| GET    | `/api/v1/tags/:id`           | Get tag details by ID  |
| PUT    | `/api/v1/tags/:id`           | Update tag by ID       |
| DELETE | `/api/v1/tags/:id`           | Soft delete tag by ID  |
| POST   | `/api/v1/tags/:id/restore`   | Restore a deleted tag  |
| DELETE | `/api/v1/tags/:id/permanent` | Permanently delete tag |
| GET    | `/api/v1/tags/trash`         | List trashed tags      |
| GET    | `/api/v1/tags/slug/:slug`    | Get tag by slug        |

### Settings

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/v1/settings`         | List all settings     |
| POST   | `/api/v1/settings`         | Create a setting      |
| GET    | `/api/v1/settings/:key`    | Get setting by key    |
| PUT    | `/api/v1/settings/:key`    | Update setting by key |
| DELETE | `/api/v1/settings/:key`    | Delete setting by key |
| GET    | `/api/v1/settings/public`  | List public settings  |
| GET    | `/api/v1/settings/private` | List private settings |

### Contacts

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/api/v1/contacts`               | List all contacts          |
| POST   | `/api/v1/contacts`               | Create a contact           |
| GET    | `/api/v1/contacts/:id`           | Get contact details by ID  |
| PUT    | `/api/v1/contacts/:id`           | Update contact by ID       |
| DELETE | `/api/v1/contacts/:id`           | Soft delete contact by ID  |
| POST   | `/api/v1/contacts/:id/restore`   | Restore a deleted contact  |
| DELETE | `/api/v1/contacts/:id/permanent` | Permanently delete contact |

---

## 📖 API Documentation

Refer to `docs/Blog App with Node JS.postman_collection.json` for complete API details.

## 📄 License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).
