# WellnessHub Frontend

A React.js frontend for the Wellness Session Platform built with Tailwind CSS.

## Features

- **Authentication**: Secure login and registration with JWT
- **Dashboard**: View all published wellness sessions
- **Session Management**: Create, edit, and manage your own sessions
- **Auto-save**: Automatic draft saving every 5 seconds
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions

## Technologies Used

- React.js 18
- React Router DOM for navigation
- Axios for API calls
- Tailwind CSS for styling
- React Hot Toast for notifications
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar
│   ├── ProtectedRoute.js # Route protection
│   └── LoadingSpinner.js # Loading component
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Public sessions dashboard
│   ├── MySessions.js   # User's session management
│   └── SessionEditor.js # Session creation/editing
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:5001`. The proxy configuration in `package.json` handles API requests during development.

## Key Features

### Auto-save Functionality
- Drafts are automatically saved every 5 seconds of inactivity
- Visual feedback shows save status
- Works for both new sessions and edits

### Authentication
- JWT token stored in localStorage
- Automatic token verification on app load
- Protected routes redirect to login

### Session Management
- Create new sessions with title, tags, and JSON file URL
- Edit existing sessions
- Filter between drafts and published sessions
- Delete sessions with confirmation

## Environment

The frontend expects the backend to be running on port 5001. Make sure your backend server is started before running the frontend.
