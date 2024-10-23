# Recipe Book Application

This is a full-stack recipe book application that allows users to browse, add, and manage their favorite recipes. It includes features like authentication, JWT token generation, and a responsive frontend built with modern frameworks.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
3. [Folder Structure](#folder-structure)
    - [Frontend](#forntend(client))
    - [Backend](#server)
4. [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
5. [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Recipe Routes](#recipe-routes)

## Features

- User authentication (login/signup)
- JWT token-based authorization
- Add, view, and manage recipes
- Search recipes by category, ingredients, and more
- Responsive frontend UI
- Backend API for CRUD operations on recipes
- Role-based access control

## Tech Stack

### Frontend
- **React**: For building the user interface
- **Tailwind CSS**: For styling the application
- **Axios**: For making HTTP requests to the backend
- **JWT**: For handling authentication
- **React Router**: For managing navigation within the app

### Backend
- **Node.js**: Runtime environment for the backend
- **Express**: Web framework for building REST APIs
- **PostgreSQL**: Database to store user and recipe data
- **Sequelize**: ORM for interacting with PostgreSQL
- **JWT**: For token-based authentication and secure API access

## Folder Structure

### Frontend(Client)

- **public/**: Static assets
- **src/**
  - **components/**: Reusable UI components
  - **assets/**: Main assets of the application
  - **services/**: API integration and services
  - **App.js**: Main application component
  - **index.js**: Entry point of the React app
- **tailwind.config.js**: Tailwind CSS configuration

### Backend(Server)

- **controllers/**: Business logic for handling API requests
- **models/**: Sequelize models for users, recipes, etc.
- **routes/**: Express routes for API endpoints
- **middleware/**: Middleware for handling JWT authentication
- **config/**: Configuration for database connection and environment variables
- **server.js**: Main server file to start the backend application

## Installation

### Prerequisites

- Node.js
- PostgreSQL

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/recipe-book-app.git
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Create a `.env` file in the `server/` directory with the following environment variables:

    ```bash
    DB_USER=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=recipe_app
    JWT_SECRET=your_secret_key
    ```

4. Set up the PostgreSQL database:

    ```bash
    psql -U postgres
    CREATE DATABASE recipe_app;
    ```

5. Run migrations (if applicable):

    ```bash
    npx sequelize db:migrate
    ```

6. Run the application:

    - For the backend:

        ```bash
        cd server
        npm start
        ```

    - For the frontend:

        ```bash
        cd client
        npm start
        ```

## API Endpoints

### User Routes
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: User login and JWT token generation
- Refer Routes file for complete list of APIs and endpoints.

### Recipe Routes
- `GET /api/recipes`: Get all recipes
- `POST /api/recipes`: Add a new recipe (JWT required)
- `PUT /api/recipes/:id`: Update a recipe (JWT required)
- `DELETE /api/recipes/:id`: Delete a recipe (JWT required)
- Refer Routes file for complete list of APIs and endpoints.
