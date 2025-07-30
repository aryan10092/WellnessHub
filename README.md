# WellnessHub - Wellness Session Platform

A full-stack wellness session platform built with React.js and Node.js that allows users to create, manage, and share wellness sessions with secure authentication, auto-save drafts, and a responsive UI.

## 🚀 Features

### ✅ Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Session Management**: Create, edit, and publish wellness sessions
- **Draft System**: Auto-save drafts every 5 seconds during editing
- **Public Dashboard**: View all published wellness sessions
- **Private Session Management**: Manage your own sessions (drafts and published)
- **Responsive UI**: Beautiful Tailwind CSS design that works on all devices

### ✨ Bonus Features
- **Auto-save Feedback**: Visual indicators for save status with timestamps
- **Logout Functionality**: Secure logout with token cleanup
- **Toast Notifications**: User-friendly feedback messages
- **Protected Routes**: Secure access to authenticated features
- **Session Filtering**: Filter sessions by status (all, drafts, published)
- **Real-time Validation**: Form validation with error handling

## 🛠️ Tech Stack

### Frontend
- **React.js** (v18.2.0) - UI Framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd wellness_app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (already created)
# Update MongoDB URI in .env if needed
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running locally on port 27017, or update the connection string in `backend/.env`

### 5. Run the Application

#### Option 1: Using VS Code Tasks
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Tasks: Run Task"
4. Select "Start Backend Server" (runs on port 5000)
5. Repeat and select "Start Frontend Server" (runs on port 3000)

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  created_at: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  title: String,
  tags: [String],
  json_file_url: String,
  status: "draft" | "published",
  created_at: Date,
  updated_at: Date
}
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sessions
- `GET /api/sessions` - Get all published sessions (public)
- `GET /api/sessions/my-sessions` - Get user's sessions (protected)
- `GET /api/sessions/my-sessions/:id` - Get single user session (protected)
- `POST /api/sessions/my-sessions/save-draft` - Save/update draft (protected)
- `POST /api/sessions/my-sessions/publish` - Publish session (protected)
- `DELETE /api/sessions/my-sessions/:id` - Delete session (protected)

## 🎯 Usage Guide

### 1. Registration/Login
- Navigate to the registration page
- Create an account with email and password (min 6 characters)
- Login with your credentials

### 2. View Published Sessions
- Visit the Dashboard to see all published wellness sessions
- View session details, tags, and external JSON files

### 3. Create Sessions
- Click "Create Session" in the navigation
- Fill in session details:
  - **Title**: Required for all sessions
  - **Tags**: Comma-separated (e.g., "yoga, meditation, relaxation")
  - **JSON File URL**: Required for publishing
- Sessions auto-save as drafts every 5 seconds
- Save as draft manually or publish immediately

### 4. Manage Your Sessions
- Go to "My Sessions" to view all your sessions
- Edit existing sessions (drafts or published)
- Delete sessions you no longer need
- See creation and update timestamps

### 5. Auto-save Features
- Drafts automatically save after 5 seconds of inactivity
- Visual feedback shows save status
- Warning before leaving with unsaved changes

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellness_platform
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5000`. Update API calls in the React components if your backend runs on a different port.

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Create a new service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Update API URLs to point to your deployed backend

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in your environment variables
3. Whitelist your deployment IP addresses

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Frontend and backend route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin setup

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running locally
   - Check connection string in `.env`
   - For Atlas: verify network access and credentials

2. **CORS Errors**
   - Backend has CORS enabled for all origins in development
   - For production, configure specific origins

3. **JWT Token Issues**
   - Tokens are stored in localStorage
   - Check browser dev tools for token presence
   - Clear localStorage if having auth issues

4. **Auto-save Not Working**
   - Check network connectivity
   - Verify backend is running
   - Look for console errors in browser dev tools

### Development Tips

- Use VS Code tasks for easy development
- Check browser console for frontend errors
- Monitor backend console for API errors
- Use MongoDB Compass for database inspection

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Wellness Session Creating! 🧘‍♀️🧘‍♂️**
