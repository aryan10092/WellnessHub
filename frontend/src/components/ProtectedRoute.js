import React from 'react';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl text-gray-300 mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access this page.
          </p>
          <a 
            href="/login"
            className="btn-primary inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
