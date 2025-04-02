# Short URL

[Short URL - Live Link](https://short-url-4.onrender.com/)

## Overview
Short URL is a URL shortening service built using **Node.js**, **Express.js**, and **MongoDB**. Users can create short links, track visit history, and manage their URLs with authentication features.

## Features
- **User Authentication** (Signup/Login without bcrypt)
- **Shorten URLs** with unique short IDs
- **Track Visits** with timestamp history
- **Redirect to Original URL**
- **Authentication Middleware** to protect user actions

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Templating Engine**: EJS
- **Session Handling**: Cookies
- **Deployment**: Render

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+ recommended)
- MongoDB Atlas or Local MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Short-URL.git
   cd Short-URL
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=8001
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Routes

### Authentication Routes
- **GET `/signup`** → Renders Signup Page
- **POST `/user/signup`** → Registers User
- **GET `/login`** → Renders Login Page
- **POST `/user/login`** → Logs in User

### URL Shortening Routes
- **POST `/url`** → Shortens a given URL (Authenticated)
- **GET `/url/:shortId`** → Redirects to the original URL

## Deployment
The project is deployed on **Render**: [Short URL](https://short-url-4.onrender.com/)

## Author
Developed by **Varun**

## License
This project is licensed under the MIT License.

