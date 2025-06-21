# 🍳 Recipe Management Application

A full-stack web application for managing and discovering recipes, built with Vue.js frontend and Node.js/Express backend.

## 🌐 Live Demo

The application is deployed and accessible at: **https://guy-dan-site.cs.bgu.ac.il/**

## ✨ Features

- **Recipe Discovery**: Browse and search through a vast collection of recipes
- **User Authentication**: Secure login and registration system
- **Personal Recipe Collection**: Save favorite recipes and create personal recipe collections
- **Family Recipes**: Special section for family recipe traditions
- **Recipe Creation**: Add and manage your own custom recipes
- **Advanced Search**: Filter recipes by ingredients, dietary restrictions, and more
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Bootstrap 5** - CSS framework for responsive design
- **Vuex/Store** - State management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **MySQL** - Database for data persistence
- **HTTPS** - Secure communication with SSL certificates
- **CORS** - Cross-origin resource sharing configuration
- **Session Management** - User authentication and session handling

## 📁 Project Structure

```
📦 Recipe Application
├── 📂 assignment3-2-207698911_325516052_assignment2/  # Backend Server
│   ├── 📂 routes/                                    # API Routes
│   │   ├── 📂 utils/                                # Database utilities
│   │   ├── auth.js                                  # Authentication routes
│   │   ├── recipes.js                               # Recipe management routes
│   │   └── user.js                                  # User management routes
│   ├── 📂 public/                                   # Served static files (built frontend)
│   ├── 📂 sql scripts/                              # Database schema
│   ├── main.js                                      # Express app configuration
│   ├── server_connection.js                         # HTTPS server setup
│   └── .env                                         # Environment variables
│
└── 📂 assignment3-3-207698911_325516052_assignment2/ # Frontend Application
    ├── 📂 src/
    │   ├── 📂 components/                           # Reusable Vue components
    │   ├── 📂 pages/                                # Page components
    │   ├── 📂 router/                               # Route definitions
    │   ├── 📂 services/                             # API service functions
    │   └── main.js                                  # Vue app entry point
    ├── 📂 public/                                   # Static assets
    └── dist/                                        # Built production files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL server (for database functionality)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment3_full
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd assignment3-2-207698911_325516052_assignment2

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### 3. Frontend Setup & Build
```bash
# Navigate to frontend directory
cd ../assignment3-3-207698911_325516052_assignment2

# Install dependencies
npm install

# Build for production
npm run build

# Copy built files to backend public directory
Copy-Item -Path "dist\*" -Destination "..\assignment3-2-207698911_325516052_assignment2\public\" -Recurse -Force
```

### 4. Database Setup
```sql
-- Create database
CREATE DATABASE mydb;

-- Run the SQL scripts to create tables
-- Located in: assignment3-2-207698911_325516052_assignment2/sql scripts/
```

### 5. SSL Certificates
For HTTPS deployment, place your SSL certificates in the backend directory:
- `privkey.pem` - Private key
- `fullchain.pem` - Certificate chain

### 6. Start the Server
```bash
cd assignment3-2-207698911_325516052_assignment2
node server_connection.js
```

## 🔧 Development

### Frontend Development Server
```bash
cd assignment3-3-207698911_325516052_assignment2
npm run serve
```

### Backend Development
```bash
cd assignment3-2-207698911_325516052_assignment2
npm run dev  # or node main.js for basic testing
```

### Building for Production
```bash
# Build frontend
cd assignment3-3-207698911_325516052_assignment2
npm run build

# Copy to backend
Copy-Item -Path "dist\*" -Destination "..\assignment3-2-207698911_325516052_assignment2\public\" -Recurse -Force

# Start production server
cd ../assignment3-2-207698911_325516052_assignment2
node server_connection.js
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
# API Keys
spooncular_apiKey=your_spoonacular_api_key

# Database Configuration
host=localhost
user=root
DBpassword=your_database_password
database=mydb

# Security
bcrypt_saltRounds=10
COOKIE_SECRET=your-secret-key-for-cookies

# Server
PORT=443
NODE_ENV=production
```

### Frontend API Configuration
The frontend automatically uses the correct API endpoint:
- **Production**: `https://guy-dan-site.cs.bgu.ac.il/`
- **Development**: `http://localhost:3000`

## 📱 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### Recipes
- `GET /recipes/search` - Search recipes
- `GET /recipes/random` - Get random recipes
- `GET /recipes/:id` - Get recipe details
- `POST /recipes` - Create new recipe

### User Management
- `GET /users/favorites` - Get user's favorite recipes
- `POST /users/favorites` - Add recipe to favorites
- `DELETE /users/favorites/:id` - Remove from favorites

## 🔐 Security Features

- **HTTPS Encryption**: All communications secured with SSL
- **Session Management**: Secure user sessions with cookies
- **CORS Protection**: Configured for specific domains
- **Input Validation**: Server-side validation for all inputs
- **Password Hashing**: Secure password storage with bcrypt

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check database credentials in `.env`
   - Verify database `mydb` exists

2. **SSL Certificate Error**
   - Ensure `privkey.pem` and `fullchain.pem` are in backend directory
   - For development, the server falls back to HTTP on port 3000

3. **Frontend API Calls to Localhost**
   - Ensure frontend is built with production configuration
   - Check `axios.defaults.baseURL` in `src/main.js`

## 📄 License

This project is part of an academic assignment and is intended for educational purposes.

## 👥 Contributors

- Guy (ID: 207698911)
- Dan (ID: 325516052)

---

**🌟 For the best experience, visit our live application at [https://guy-dan-site.cs.bgu.ac.il/](https://guy-dan-site.cs.bgu.ac.il/)**
