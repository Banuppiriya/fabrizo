import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/axiosInstance';
import { Edit, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// This theme object helps manage consistent styling.
// Ideally, you'd extend your tailwind.config.js for these custom colors/fonts.
const theme = {
  colors: {
    primary: '#B26942', // Example primary color (e.g., a warm brown/orange)
    secondary: '#F2E1C1', // Example secondary color (e.g., a light cream)
    background: '#F8F8F8', // Lighter background for the page
    text: '#1C1F43', // Dark text color
    textSecondary: '#3B3F4C', // Slightly lighter text for descriptions
    border: '#D1D5DB', // Standard border color
  },
  fonts: {
    heading: 'Playfair Display, serif', // Example custom font for headings
    body: 'Montserrat, sans-serif',    // Example custom font for body text
  },
  borderRadius: '0.5rem', // Example border radius
};

const Profile = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', profilePicture: '' });
  const [originalFormData, setOriginalFormData] = useState({ username: '', email: '', profilePicture: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize form data from user profile
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
        setFilePreviewUrl(user.profilePicture);
      }
    }
  }, [user]);
  // (Remove this entire block; it is misplaced and duplicates logic already present in your useEffect above)

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file)); // Create a local URL for preview
      setError(''); // Clear any previous errors
    } else {
      setSelectedFile(null);
      setFilePreviewUrl(formData.profilePicture || null); // Revert to existing or null
    }
  };

  // Toggle edit mode and handle reverting data on cancel
  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalFormData);
      setFilePreviewUrl(originalFormData.profilePicture || null); // Revert file preview
      setSelectedFile(null); // Clear selected file
      setError('');
    }
    setIsEditing(!isEditing);
  };

  // Handle input changes in the form fields (for username, email)
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let uploadedImageUrl = formData.profilePicture; // Start with current image

    try {
      if (selectedFile) {
        // Step 1: Upload the new profile picture if a file is selected
        const uploadFormData = new FormData();
        uploadFormData.append('profilePicture', selectedFile);
        const uploadRes = await api.post('/upload/profile-picture', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      // Step 2: Update user profile with new data
      await api.put('/user/profile', {
        username: formData.username,
        email: formData.email,
        profilePicture: uploadedImageUrl,
      });

      // Step 3: Refresh profile via auth context
      await fetchProfile();

      // Step 4: Update local state
      const updatedOriginalData = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || ''
      };
      setOriginalFormData(updatedOriginalData);
      setFormData(updatedOriginalData);
      setFilePreviewUrl(user.profilePicture || null);
      setSelectedFile(null);
      setIsEditing(false);

      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      alert('Failed to update profile: ' + errorMessage);
    }
  };

  // --- Conditional Rendering for Loading, Error, and No Profile Data ---
  if (authLoading) {
    return (
      <div
        className="text-center py-20 text-gray-700 font-semibold text-lg min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        Loading profile...
      </div>
    );
  }

  if (authError && !isEditing) {
    return (
      <div
        className="text-center py-10 text-red-600 font-bold text-lg bg-red-50 rounded-lg mx-auto max-w-md p-4 border border-red-200 mt-10 shadow-md"
        style={{ backgroundColor: theme.colors.background }}
      >
        {authError}
      </div>
    );
  }

  if (!user) // If no user data after loading and no errors
    return (
      <div
        className="text-center py-10 text-gray-500 text-lg min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        No profile data available.
      </div>
    );

  return (
    <div
      className="min-h-screen py-4 px-2 flex items-center justify-center"
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fonts.body }}
    >
      <div className="max-w-2xl w-full mx-auto shadow-xl rounded-xl p-4 transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`, borderRadius: theme.borderRadius }}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 flex-col sm:flex-row text-center sm:text-left">
            {/* Profile Picture Display (Conditional for editing vs. viewing) */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 relative overflow-hidden group border-4"
              style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary, borderColor: theme.colors.primary, fontFamily: theme.fonts.heading }}
            >
              {filePreviewUrl ? (
                <img
                  src={
                    filePreviewUrl.startsWith('blob:')
                      ? filePreviewUrl
                      : filePreviewUrl.startsWith('http')
                        ? filePreviewUrl
                        : `http://localhost:5000${filePreviewUrl}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                user?.username?.[0]?.toUpperCase() || 'U'
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-sm"
                  title="Upload New Picture"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  <Upload size={24} />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-0.5" style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}>User Profile</h2>
              <p className="text-xs" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Manage your account details</p>
            </div>
          </div>
          {/* Edit/Cancel button */}
          <button
            onClick={handleEditToggle}
            className="p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: isEditing ? '#F8D7DA' : theme.colors.secondary, color: isEditing ? '#B26942' : theme.colors.text, border: `2px solid ${theme.colors.primary}` }}
            title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
          >
            {isEditing ? <X size={24} className="text-red-500" /> : <Edit size={24} className="text-gray-500 hover:text-gray-700" />}
          </button>
        </div>

        <hr className="mb-3 border-[#B26942]" />

        {isEditing ? (
          // Form for editing profile
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && ( // Display form-specific error if submission fails
              <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-200 shadow-sm" style={{ fontFamily: theme.fonts.body }}>
                {error}
              </p>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div>
              <label htmlFor="username" className="block text-xs font-medium mb-0.5" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-0.5 block w-full rounded-lg border px-3 py-1 text-xs focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{ borderRadius: theme.borderRadius, borderColor: theme.colors.primary, fontFamily: theme.fonts.body, color: theme.colors.text }}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-0.5" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-0.5 block w-full rounded-lg border px-3 py-1 text-xs focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{ borderRadius: theme.borderRadius, borderColor: theme.colors.primary, fontFamily: theme.fonts.body, color: theme.colors.text }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-3 py-1.5 text-xs rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm"
                style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text, border: `1px solid ${theme.colors.primary}`, fontFamily: theme.fonts.body }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-white text-xs rounded-md font-medium flex items-center gap-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md"
                style={{ backgroundColor: theme.colors.primary, fontFamily: theme.fonts.body }}
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          // Display profile details when not in edit mode
          <div className="space-y-2 text-xs" style={{ color: theme.colors.text, fontFamily: theme.fonts.body }}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.secondary, border: `1px solid ${theme.colors.primary}` }}>
              <span className="font-semibold" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Username:</span>
              <span className="mt-0.5 sm:mt-0 font-medium" style={{ color: theme.colors.text }}>{user.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.secondary, border: `1px solid ${theme.colors.primary}` }}>
              <span className="font-semibold" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Email:</span>
              <span className="mt-0.5 sm:mt-0 font-medium" style={{ color: theme.colors.text }}>{user.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 px-2 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.secondary, border: `1px solid ${theme.colors.primary}` }}>
              <span className="font-semibold" style={{ color: theme.colors.textSecondary, fontFamily: theme.fonts.body }}>Role:</span>
              <span className="mt-0.5 sm:mt-0 font-medium capitalize" style={{ color: theme.colors.text }}>{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;