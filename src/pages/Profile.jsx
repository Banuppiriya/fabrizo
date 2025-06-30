import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null); // Initial state is null
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/tailors/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/tailors/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      setUser(data.tailor); // Backend returns `{ message, tailor }`
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center text-center sm:items-start sm:text-left space-y-2">
            <img
              src={user.avatar || '/avatar-placeholder.png'}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
            />
            <button className="text-sm text-indigo-600 hover:underline">
              Change Avatar
            </button>
          </div>

          {/* Profile Form */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="username"
                value={formData.username || ''}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                disabled={!editing}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                disabled={!editing}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-4 justify-end">
          {!editing ? (
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
