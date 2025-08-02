# 🚀 TaskFlow - Personal Task Management Application

A modern, full-stack task management application built with Django REST Framework backend and React.js frontend, featuring MongoDB database integration.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication with session management
- 👤 **User Registration & Login** - Complete authentication system
- 📝 **Personal Task Management** - Each user sees only their own tasks
- 🗑️ **Production-Level Delete Confirmation** - Type "DELETE" to confirm deletions
- 🔄 **Automatic Token Refresh** - Seamless session management (30-minute timeout)
- ⚡ **Real-time Updates** - Instant UI feedback with loading states
- 📱 **Responsive Design** - Modern UI with TailwindCSS
- 🛡️ **Security Features** - Session-based storage, user isolation, CORS protection

## 🛠️ Tech Stack

### Backend
- **Django 4.2.16** - Web framework
- **Django REST Framework** - API framework
- **MongoDB Atlas** - Cloud database
- **PyMongo** - MongoDB driver
- **JWT Authentication** - Secure token-based auth

### Frontend
- **React 19.1.0** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client

## 📁 Project Structure

```
TaskFlow/
├── 📁 Client/                          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/              # UI Components
│   │   ├── 📁 context/                 # React Context
│   │   ├── 📁 api/                     # API Layer
│   │   ├── App.jsx                     # Main App
│   │   └── main.jsx                    # Entry Point
│   ├── package.json
│   └── tailwind.config.js
├── 📁 Server/                          # Django Backend
│   ├── 📁 App/                         # Django App
│   │   ├── mongodb_service.py          # MongoDB Operations
│   │   ├── views.py                    # API Views
│   │   ├── models.py                   # Django Models
│   │   └── urls.py                     # URL Routing
│   ├── 📁 Project/                     # Django Settings
│   │   └── settings.py                 # Configuration
│   ├── .env                           # Environment Variables
│   ├── manage.py                      # Django CLI
│   └── requirements.txt               # Python Dependencies
├── vercel.json                        # Deployment Config
└── README.md                          # This File
```

## 🚀 Local Setup Instructions

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Git**

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TaskFlow
```

### 2. Backend Setup (Django + MongoDB)

#### Navigate to Server Directory
```bash
cd Server
```

#### Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the `Server/` directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://admin:admin%402023@cluster0.u3djt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=taskflow_db
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin@2023

# Django Configuration
DEBUG=True
SECRET_KEY=django-insecure-sgfas)t_8hf721v1seja&@45u55(*3387g__mzd4ahme0zsgol
DJANGO_SETTINGS_MODULE=Project.settings

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS=True
```

#### Run Database Migrations
```bash
python manage.py migrate
```

#### Create Admin User (Optional)
```bash
python manage.py createsuperuser
```

#### Start Django Server
```bash
python manage.py runserver
```
✅ Backend running at: `http://localhost:8000`

### 3. Frontend Setup (React)

#### Open New Terminal & Navigate to Client
```bash
cd Client
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (get JWT tokens)
- `POST /api/auth/refresh/` - Refresh JWT token

### Tasks (Requires Authentication)
- `GET /api/tasks/` - Get user's tasks
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/<id>/` - Get specific task
- `PUT /api/tasks/<id>/` - Update task
- `DELETE /api/tasks/<id>/` - Delete task

## 🧪 Testing the Application

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepass123"
  }'
```

### 3. Create a Task (with JWT token)
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task"
  }'
```

## 🔧 Development Commands

### Backend Commands
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install new package
pip install package_name
pip freeze > requirements.txt

# Django commands
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser
python manage.py shell
```

### Frontend Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package_name
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `cd Client && npm run build`
   - **Output Directory**: `Client/dist`

### 3. Set Environment Variables in Vercel Dashboard
```env
MONGODB_URI=mongodb+srv://admin:admin%402023@cluster0.u3djt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=taskflow_production
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin@2023
DEBUG=False
SECRET_KEY=your-production-secret-key
CORS_ALLOW_ALL_ORIGINS=True
DJANGO_SETTINGS_MODULE=Project.settings
```

## 🛡️ Security Features

- ✅ **Session-based Authentication** (sessionStorage, not localStorage)
- ✅ **30-minute Auto-logout** on inactivity
- ✅ **Activity Tracking** extends session automatically
- ✅ **User Data Isolation** (MongoDB user_id filtering)
- ✅ **JWT Token Rotation** for enhanced security
- ✅ **CORS Protection** configured properly
- ✅ **Input Validation** on all endpoints

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# MongoDB connection failed
- Check internet connection
- Verify MongoDB URI in .env file
- Ensure MongoDB Atlas IP whitelist includes your IP

# Module not found
- Activate virtual environment: venv\Scripts\activate
- Install requirements: pip install -r requirements.txt

# Port already in use
- Kill process: taskkill /f /im python.exe  # Windows
- Or use different port: python manage.py runserver 8001
```

#### Frontend Issues
```bash
# API connection failed
- Ensure Django server is running on port 8000
- Check CORS settings in Django settings.py

# npm install fails
- Clear cache: npm cache clean --force
- Delete node_modules and reinstall: rm -rf node_modules && npm install
```

### Debug Tips
- Check browser developer console for frontend errors
- Use Django admin at `http://localhost:8000/admin/`
- Monitor Django server logs in terminal
- Test API endpoints with curl or Postman

## 📞 Support

If you encounter issues:
1. Check this README for solutions
2. Verify all environment variables are set correctly
3. Ensure both servers are running
4. Check browser developer tools for errors

---

**🎉 Your TaskFlow application is ready! Start managing your tasks efficiently!**