import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
//import api from '../api/config';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SessionEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  const { id } = useParams(); // For editing existing session
  const navigate = useNavigate();
  const autoSaveTimeoutRef = useRef(null);

  const fetchSession = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://wellnesshub-1oc3.onrender.com/api/sessions/my-sessions/${sessionId}`);
      const session = response.data;
      //console.log('Fetched session:', session);
      
      setFormData({
        title: session.title || '',
        tags: Array.isArray(session.tags) ? session.tags.join(', ') : '',
        json_file_url: session.json_file_url || ''
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      toast.error('Failed to load session');
      navigate('/my-sessions');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchSession(id);
    }
  }, [id, fetchSession]);

  const handleAutoSave = useCallback(async () => {
    if (!formData.title.trim()) return;

    try {
      setAutoSaveStatus('Saving...');
      
      const payload = {
        title: formData.title,
        tags: formData.tags
      };

      // Only include json_file_url if it has a value
      if (formData.json_file_url.trim()) {
        payload.json_file_url = formData.json_file_url;
      }

      if (isEditing && id) {
        payload.sessionId = id;
      }

      const response = await axios.post('https://wellnesshub-1oc3.onrender.com/api/sessions/my-sessions/save-draft', payload);

      setAutoSaveStatus('Saved');
      setLastSaved(new Date());
      
      // Clear status after 2 seconds
      setTimeout(() => setAutoSaveStatus(''), 2000);
      
      // If this was a new session, we should now be in editing mode
      if (!isEditing && response.data.session) {
        setIsEditing(true);
        // Update the URL with the session ID
        const sessionId = response.data.session._id;
        window.history.replaceState(null, '', `/edit-session/${sessionId}`);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('Failed to save');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, [formData.title, formData.tags, formData.json_file_url, isEditing, id]);

  // Auto-save functionality
  useEffect(() => {
    if (!formData.title.trim()) {
      return; // Don't auto-save empty sessions
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save after 5 seconds of inactivity
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 5000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData.title, formData.tags, formData.json_file_url, handleAutoSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (isPublishing = false) => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (isPublishing && !formData.json_file_url.trim()) {
      newErrors.json_file_url = 'JSON file URL is required for publishing';
    }

    if (formData.json_file_url.trim()) {
      try {
        new URL(formData.json_file_url);
      } catch {
        newErrors.json_file_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        title: formData.title,
        tags: formData.tags
      };

      // Only include json_file_url if it has a value
      if (formData.json_file_url.trim()) {
        payload.json_file_url = formData.json_file_url;
      }

      if (isEditing && id) {
        payload.sessionId = id;
      }

      await axios.post('https://wellnesshub-1oc3.onrender.com/api/sessions/my-sessions/save-draft', payload);
      toast.success('Draft saved successfully!');
      navigate('/my-sessions');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(error.response?.data?.message || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm(true)) {
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        title: formData.title,
        tags: formData.tags,
        json_file_url: formData.json_file_url
      };

      if (isEditing && id) {
        payload.sessionId = id;
      }

      await axios.post('https://wellnesshub-1oc3.onrender.com/api/sessions/my-sessions/publish', payload);
      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error) {
      console.error('Error publishing session:', error);
      toast.error(error.response?.data?.message || 'Failed to publish session');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Session' : 'Create New Session'}
          </h1>
          <p className="text-gray-600">
            Create and customize your wellness session
          </p>
          
          {/* Auto-save status */}
          <div className="mt-2 flex items-center space-x-4">
            {autoSaveStatus && (
              <span className={`text-sm ${
                autoSaveStatus === 'Saved' ? 'text-green-600' : 
                autoSaveStatus === 'Saving...' ? 'text-blue-600' : 'text-red-600'
              }`}>
                {autoSaveStatus}
              </span>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="card max-w-2xl">
          <form className="space-y-6">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Session Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter session title (e.g., 'Morning Yoga Flow')"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="error-text">{errors.title}</p>
              )}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="input-field"
                placeholder="Enter tags separated by commas (e.g., 'yoga, meditation, morning')"
                value={formData.tags}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* JSON File URL */}
            <div className="form-group">
              <label htmlFor="json_file_url" className="form-label">
                JSON File URL (Optional for drafts)
              </label>
              <input
                id="json_file_url"
                name="json_file_url"
                type="url"
                className={`input-field ${errors.json_file_url ? 'border-red-500' : ''}`}
                placeholder="https://example.com/session-data.json (optional for drafts)"
                value={formData.json_file_url}
                onChange={handleChange}
              />
              {errors.json_file_url && (
                <p className="error-text">{errors.json_file_url}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                URL to the JSON file containing your session data. Optional for drafts, required for publishing.
              </p>
            </div>

            {/* Auto-save info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-blue-600">
                  <h3 className="text-sm font-medium">Auto-save enabled</h3>
                  <p className="text-sm mt-1">
                    Your changes are automatically saved as drafts every 5 seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading || !formData.title.trim()}
                className="btn-secondary flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Save as Draft'}
              </button>
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading || !formData.title.trim()}
                className="btn-wellness flex items-center justify-center"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Publish Session'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/my-sessions')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {formData.title && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="card max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {formData.title}
              </h3>
              
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-wellness-100 text-wellness-800 rounded-full"
                      >
                        {trimmedTag}
                      </span>
                    );
                  })}
                </div>
              )}
              
              {formData.json_file_url && (
                <p className="text-sm text-primary-600">
                  Session file: {formData.json_file_url}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionEditor;
