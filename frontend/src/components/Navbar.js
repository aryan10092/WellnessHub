import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {  MenuIcon, X } from 'lucide-react';


const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);


  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

 const isActive = (path) => {
    return window.location.pathname === path ? 'bg-primary-600 hover:bg-primar text-white px-3 py-2 rounded-md text-sm font-medium transition-colors' : 'text-gray-700 hover:text-primary-600';
  };

  
return(
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-16">
        
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">WellnessHub</h1>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none "
              aria-expanded="false"
            >
              
              {!isMobileMenuOpen ? (
               
                <MenuIcon className="h-6 w-6" />

              ) : (
                
                <X className="h-6 w-6" />
              )}
            </button>
          </div>

          
          <div className="flex items-center space-x-8 hidden md:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-6 pr-56 gap-12 ">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-md font-semibold transition-colors ${isActive('/dashboard')}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-sessions"
                    className={`px-3 py-2 rounded-md text-md font-semibold transition-colors ${isActive('/my-sessions')}`}
                  >
                    My Sessions
                  </Link>
                  <Link
                    to="/create-session"
                    className={`px-3 py-2 rounded-md text-md font-semibold transition-colors ${isActive('/create-session')}`}
                  >
                    Create Session
                  </Link>
                </div>

                
                <div className="flex items-center space-x-1 absolute right-12">
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                  <div className="w-8 h-8 flex bg-primary-100 text-primary-700 items-center justify-center rounded-full font-bold uppercase">
                    {user?.email[0]}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-sessions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    My Sessions
                  </Link>
                  <Link
                    to="/create-session"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Create Session
                  </Link>
                  <div className="flex items-center px-3 py-2 space-x-3 border-t border-gray-200 mt-3 pt-3">
                    <div className="w-8 h-8 flex bg-primary-100 text-primary-700 items-center justify-center rounded-full font-bold uppercase">
                      {user?.email[0]}
                    </div>
                    <span className="text-sm text-gray-700">{user?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
