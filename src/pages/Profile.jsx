// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import api from '../utils/axiosInstance';
import { Edit, Save, X, Image as ImageIcon, Upload } from 'lucide-react'; // Import ImageIcon and Upload
// If you uncomment toast, ensure 'react-hot-toast' is installed
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({ username: '', email: '', profilePicture: '' });
  const [formData, setFormData] = useState({ username: '', email: '', profilePicture: '' });

  // New state for profile picture upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input to trigger click

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile');
        setProfile(data);
        const initialData = {
          username: data.username || '',
          email: data.email || '',
          profilePicture: data.profilePicture || '' // Fetch existing profile picture URL
        };
        setFormData(initialData);
        setOriginalFormData(initialData);
        if (data.profilePicture) {
          setFilePreviewUrl(data.profilePicture); // Set preview if picture exists
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError('Failed to fetch profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    setLoading(true); // Set loading for submission

    let uploadedImageUrl = formData.profilePicture; // Start with current image

    try {
      if (selectedFile) {
        // Step 1: Upload the new profile picture if a file is selected
        const uploadFormData = new FormData();
        uploadFormData.append('profilePicture', selectedFile);

        // IMPORTANT: Replace '/api/upload/profile-picture' with your actual backend upload endpoint
        // This endpoint should return the URL of the uploaded image.
        const uploadRes = await api.post('/upload/profile-picture', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedImageUrl = uploadRes.data.imageUrl; // Assuming backend returns { imageUrl: '...' }
        // toast.success('Profile picture uploaded!'); // If using react-hot-toast
      }

      // Step 2: Update user profile with new data, including the (potentially new) image URL
      const { data } = await api.put('/user/profile', {
        username: formData.username,
        email: formData.email,
        profilePicture: uploadedImageUrl, // Send the new or existing image URL
      });

      setProfile(data);
      const updatedOriginalData = {
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture || ''
      };
      setOriginalFormData(updatedOriginalData);
      setFormData(updatedOriginalData); // Update formData with server's response
      setFilePreviewUrl(data.profilePicture || null); // Update preview from server response
      setSelectedFile(null); // Clear selected file after successful upload
      setIsEditing(false); // Exit edit mode
      alert('Profile updated successfully!'); // Simple alert for success
      // toast.success('Profile updated successfully!'); // If using react-hot-toast

    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      alert('Failed to update profile: ' + errorMessage); // Simple alert for error
      // toast.error('Failed to update profile: ' + errorMessage); // If using react-hot-toast
    } finally {
      setLoading(false); // End loading regardless of success or failure
    }
  };

  // --- Conditional Rendering for Loading, Error, and No Profile Data ---
  if (loading && !profile) // Only show loading if profile isn't loaded yet
    return (
      <div
        className="text-center py-20 text-gray-700 font-semibold text-lg min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background }}
      >
        Loading profile...
      </div>
    );

  if (error && !isEditing && !loading) // Show global fetch error if not in edit mode and not loading
    return (
      <div
        className="text-center py-10 text-red-600 font-bold text-lg bg-red-50 rounded-lg mx-auto max-w-md p-4 border border-red-200 mt-10 shadow-md"
        style={{ backgroundColor: theme.colors.background }}
      >
        {error}
      </div>
    );

  if (!profile && !loading) // If no profile data after loading and no errors
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
      className="min-h-screen py-10 px-4 flex items-center justify-center"
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fonts.body }}
    >
      <div className="max-w-3xl w-full mx-auto bg-white shadow-xl rounded-xl p-8 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
          <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
            {/* Profile Picture Display (Conditional for editing vs. viewing) */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0 relative overflow-hidden group"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.secondary }}
            >
              {filePreviewUrl ? (
                <img
                  src={filePreviewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.username?.[0]?.toUpperCase() || 'U'
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-sm"
                  title="Upload New Picture"
                >
                  <Upload size={24} />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}>User Profile</h2>
              <p className="text-sm text-gray-600" style={{ color: theme.colors.textSecondary }}>Manage your account details</p>
            </div>
          </div>
          {/* Edit/Cancel button */}
          <button
            onClick={handleEditToggle}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
          >
            {isEditing ? <X size={24} className="text-red-500" /> : <Edit size={24} className="text-gray-500 hover:text-gray-700" />}
          </button>
        </div>

        <hr className="mb-6 border-gray-200" />

        {isEditing ? (
          // Form for editing profile
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && ( // Display form-specific error if submission fails
              <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center border border-red-200 shadow-sm">
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700" style={{ color: theme.colors.textSecondary }}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{ borderRadius: theme.borderRadius, focus: { ringColor: theme.colors.primary } }}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ color: theme.colors.textSecondary }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                style={{ borderRadius: theme.borderRadius, focus: { ringColor: theme.colors.primary } }}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-5 py-2 text-sm rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white text-sm rounded-md font-medium flex items-center gap-2 bg-[#1C1F43] hover:bg-[#3B3F4C] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C1F43] shadow-md"
                style={{ backgroundColor: theme.colors.primary }} // Apply primary theme color
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          // Display profile details when not in edit mode
          <div className="space-y-5 text-sm text-gray-800" style={{ color: theme.colors.text }}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-600">Username:</span>
              <span className="mt-1 sm:mt-0 font-medium">{profile.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-600">Email:</span>
              <span className="mt-1 sm:mt-0 font-medium">{profile.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 px-3 bg-gray-50 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-600">Role:</span>
              <span className="mt-1 sm:mt-0 font-medium capitalize">{profile.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;