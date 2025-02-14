# readmefy-api

## 🚀 Project Overview

This is a basic Express.js project setup with a structured folder architecture, including routes, controllers, middlewares, and more. The project is designed for scalability and maintainability.

## 📂 Folder Structure

```
/express-project
│── /node_modules        # Installed dependencies
│── /src                 # Main source code
│   ├── /config          # Configuration files
│   ├── /controllers     # Handles HTTP request logic
│   ├── /middlewares     # Custom middlewares
│   ├── /routes          # Route definitions
│   ├── /utils           # Utility functions
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
│
├── .gitignore           # Files to ignore in Git
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
└── README.md            # Documentation
```

## 🔧 Installation & Setup

### 1️⃣ Prerequisites

Ensure you have Node.js and npm installed.

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/ymerej-noyorb/readmefy-api.git
```

```bash
cd readmefy-api
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:${PORT}
RATE_LIMIT=100
```

### 5️⃣ Start the Server

```bash
npm start
```

The server will start at http://localhost:3000.

## 📜 License

This project is licensed under the [GPL-3.0 License](LICENSE).