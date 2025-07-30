import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions/my-sessions')
      
     // console.log(response)
      setSessions(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load your sessions');
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/my-sessions/${sessionId}`);
      setSessions(sessions.filter(session => session._id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
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

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const SessionCard = ({ session }) => (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 flex-1">
              {session.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              session.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {session.status}
            </span>
          </div>
          
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
            <p>Created: {formatDate(session.created_at)}</p>
            <p>Updated: {formatDate(session.updated_at)}</p>
            {session.json_file_url && (
              <p className="text-primary-600">Has JSON file</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/edit-session/${session._id}`)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Edit
            </button>
            {session.json_file_url && (
              <a
                href={session.json_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wellness-600 hover:text-wellness-800 text-sm font-medium"
              >
                View File
              </a>
            )}
          </div>
          <button
            onClick={() => deleteSession(session._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
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
            My Sessions
          </h1>
          <p className="text-gray-600">
            Manage your wellness sessions and drafts
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Link
              to="/create-session"
              className="btn-wellness"
            >
              Create New Session
            </Link>
            <Link
              to="/dashboard"
              className="btn-secondary"
            >
              View All Sessions
            </Link>
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'draft'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Drafts ({sessions.filter(s => s.status === 'draft').length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'published'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Published ({sessions.filter(s => s.status === 'published').length})
            </button>
          </div>
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
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' 
                ? 'No sessions yet' 
                : `No ${filter} sessions`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Create your first wellness session to get started!'
                : `You don't have any ${filter} sessions yet.`}
            </p>
            <Link
              to="/create-session"
              className="btn-wellness"
            >
              Create Session
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        )}

        {/* Stats */}
        {sessions.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              {filter === 'all' 
                ? `You have ${sessions.length} session${sessions.length !== 1 ? 's' : ''} total`
                : `Showing ${filteredSessions.length} ${filter} session${filteredSessions.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySessions;
