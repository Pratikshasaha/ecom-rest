# E-commerce REST API

This is a simple Node.js Express REST API for adding users.

## Installation

Run `npm install` to install dependencies.

## Running the Server

Run `npm start` to start the server on port 3001.

## API Endpoints

### Add User

- **POST** `/users`

  Adds a new user.

  **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

  **Response:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

  **Status Code:** 201 Created

## Notes

This is a basic implementation using in-memory storage. For production, use a database.