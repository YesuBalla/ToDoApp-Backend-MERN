# 🛠️ ToDo App – Backend

This is the backend server for the Fully Functional ToDo App built using **Node.js**, **Express**, and **MongoDB**.

## 📌 Overview

This server handles authentication, task management APIs, and secure communication using JWT. It also supports CSV import and strong password policies via Joi.

## ✨ Features

- User signup/signin with hashed passwords (bcrypt)
- JWT-based authentication
- Task CRUD operations
- CSV import support
- Password complexity validation

## 🧰 Technologies Used

- Node.js, Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Joi, joi-password-complexity for validation
- Bcrypt for hashing

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YesuBalla/ToDoApp-Backend-MERN.git
   cd ToDoApp-Backend-MERN
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root:
   ```env
   MONGODB_URL=mongodb+srv://<your_cluster>.mongodb.net/todo
   PORT=4501
   JWTPRIVATEKEY=your_jwt_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

## 📘 API Endpoints

### 🧑 User Routes

- `POST /user/signup` – Register new user
- `POST /user/signin` – Authenticate user
- `PUT /user/update` – Change password
- `DELETE /user/delete` – Delete user

### ✅ Task Routes

- `POST /todo/create` – Create new task
- `GET /todo/read` – Get all tasks
- `PUT /todo/update` – Update task
- `DELETE /todo/delete` – Delete task

## 🔐 Security

- Passwords are hashed using bcrypt before storage.
- JWT tokens are issued for user authentication.
- Joi ensures data validation and password complexity.