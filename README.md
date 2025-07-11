# PC Craft Backend

This is the backend API for the PC Craft application, built with Node.js and Express. It provides user authentication and management features, and is designed to be easily extensible for additional functionality.

## Features

- User registration and login
- JWT-based authentication middleware
- RESTful API endpoints
- Organized code structure (models, routes, middleware)
- API documentation included

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- MongoDB (local or cloud instance)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pc-craft-be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     PORT=5000
     ```

## Running the Project

- **Start the server:**
  ```bash
  npm start
  ```
  The server will run on the port specified in your `.env` file (default: 5000).

- **Development mode (auto-restart on changes):**
  ```bash
  npm run dev
  ```
  This uses nodemon to automatically restart the server when you make changes.

- **Run tests:**
  ```bash
  npm test
  ```

## API Documentation

- See `api_doc/api_documentation.md` or `api_doc/api_documentation.pdf` for detailed API usage.

## Project Structure

```
index.js              # Entry point and server startup
package.json          # Project metadata and scripts
README.md             # Project documentation
api_doc/              # API documentation
middleware/           # Custom middleware (e.g., authentication)
models/               # Mongoose models
routes/               # API route handlers
tests/                # Automated tests
```

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
