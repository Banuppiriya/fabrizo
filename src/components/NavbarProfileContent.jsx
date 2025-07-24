import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axiosInstance';
import { Edit, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const theme = {
  colors: {
    primary: '#B26942',
    secondary: '#F2E1C1',
    background: '#F8F8F8',
    text: '#1C1F43',
    textSecondary: '#3B3F4C',
    border: '#D1D5DB',
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Montserrat, sans-serif',
  },
  borderRadius: '0.5rem',
};

const NavbarProfileContent = ({ onProfilePictureUpdate }) => {
  const { user, loading: authLoading, error: authError, fetchProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', profilePicture: '' });
  const [originalFormData, setOriginalFormData] = useState({ username: '', email: '', profilePicture: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:')) return url;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      const initialData = {
        username: user.username || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      };
      setFormData(initialData);
      setOriginalFormData(initialData);
      if (user.profilePicture) {
        setFilePreviewUrl(getImageUrl(user.profilePicture));
      }
    }
  }, [user]); // Only run when user data changes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
      setError('');
    } else {
      setSelectedFile(null);
      setFilePreviewUrl(formData.profilePicture ? getImageUrl(formData.profilePicture) : null);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalFormData);
      setFilePreviewUrl(originalFormData.profilePicture ? getImageUrl(originalFormData.profilePicture) : null);
      setSelectedFile(null);
      setError('');
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate form data
      if (!formData.username || !formData.email) {
        setError('Username and email are required');
        setLoading(false);
        return;
      }

      let uploadedImageUrl = formData.profilePicture;

      // Handle image upload if there's a new file
      if (selectedFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('profilePicture', selectedFile);
          const uploadRes = await api.post('/upload/profile-picture', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          if (!uploadRes.data?.imageUrl) {
            throw new Error('Image upload failed');
          }
          uploadedImageUrl = uploadRes.data.imageUrl;
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          setError('Failed to upload profile picture. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Update profile
      const { data } = await api.put('/user/profile', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        profilePicture: uploadedImageUrl,
      });

      if (!data) {
        throw new Error('No data received from server');
      }

      // Force a single profile refresh
      await fetchProfile(true);
      
      // Update local state with new data
      const updatedOriginalData = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || ''
      };
      setOriginalFormData(updatedOriginalData);
      setFormData(updatedOriginalData);
      setFilePreviewUrl(user.profilePicture ? getImageUrl(user.profilePicture) : null);
      setSelectedFile(null);
      setIsEditing(false);

      // Call callback if provided
      if (onProfilePictureUpdate) {
        onProfilePictureUpdate(data.profilePicture || null);
      }

      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-10 text-gray-700">Loading...</div>;
  }
  if (error && !isEditing) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  if (!user) {
    return <div className="text-center py-10 text-gray-500">No profile data available.</div>;
  }

  return (
    <div className="py-4 px-2">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 relative overflow-hidden group" style={{ backgroundColor: theme.colors.primary, color: theme.colors.secondary }}>
          {filePreviewUrl ? (
            <img 
              src={getImageUrl(filePreviewUrl)} 
              alt={`${user?.username || 'User'}'s profile`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.onerror = null;
                e.target.src = ''; // Remove broken image
                setFilePreviewUrl(null);
              }}
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center bg-[#B26942] text-white">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
          {isEditing && (
            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-sm" title="Upload New Picture">
              <Upload size={20} />
            </button>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}>User Profile</h2>
          <p className="text-xs text-gray-600" style={{ color: theme.colors.textSecondary }}>Manage your account details</p>
        </div>
      </div>
      <hr className="mb-4 border-gray-200" />
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">{error}</p>}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-700">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded border border-gray-300 px-3 py-1 text-xs focus:ring-2 focus:ring-opacity-50" style={{ borderRadius: theme.borderRadius }} />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded border border-gray-300 px-3 py-1 text-xs focus:ring-2 focus:ring-opacity-50" style={{ borderRadius: theme.borderRadius }} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleEditToggle} className="px-3 py-1 text-xs rounded font-medium text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-3 py-1 text-white text-xs rounded font-medium flex items-center gap-1 bg-[#1C1F43] hover:bg-[#3B3F4C]" style={{ backgroundColor: theme.colors.primary }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3 text-xs text-gray-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 bg-gray-50 rounded shadow-sm">
            <span className="font-semibold text-gray-600">Username:</span>
            <span className="mt-1 sm:mt-0 font-medium">{user.username}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 bg-gray-50 rounded shadow-sm">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="mt-1 sm:mt-0 font-medium">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 bg-gray-50 rounded shadow-sm">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="mt-1 sm:mt-0 font-medium capitalize">{user.role}</span>
          </div>
          <div className="flex justify-end pt-2">
            <button type="button" onClick={handleEditToggle} className="px-3 py-1 text-xs rounded font-medium text-white bg-[#B26942] hover:bg-[#8a4c2b]">Edit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarProfileContent;
