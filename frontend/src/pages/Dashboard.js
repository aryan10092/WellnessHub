import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublishedSessions();
  }, []);

  const fetchPublishedSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://wellnesshub-1oc3.onrender.com/api/sessions')
      //console.log(response)

      setSessions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SessionCard = ({ session }) => (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <div className="flex-1">
            
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {session.title}
          </h3>
          
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {session.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-wellness-100 text-wellness-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-600 mb-3">
            <p>By: {session.author?.email || 'Unknown Author'}</p>
            <p>Published: {formatDate(session.updated_at)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {session.json_file_url && (
            <a
              href={session.json_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View Session File →
            </a>
          )}
          <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
            Published
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wellness Sessions
          </h1>
          <p className="text-gray-600">
            Discover and explore wellness sessions created by our community
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            to="/create-session"
            className="btn-wellness"
          >
            Create New Session
          </Link>
          <Link
            to="/my-sessions"
            className="btn-secondary"
          >
            My Sessions
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-600">
                <h3 className="text-sm font-medium">Error</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🧘‍♀️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a wellness session!
            </p>
            <Link
              to="/create-session"
              className="btn-wellness"
            >
              Create First Session
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}

        {/* Stats */}
        {sessions.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Showing {sessions.length} published session{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
