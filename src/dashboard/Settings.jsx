import React, { useState } from 'react';
import theme from '../theme'; // Corrected: Removed curly braces

const Settings = () => {
  const [formData, setFormData] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Settings saved successfully!');
    // In a real application, you'd send this data to your backend API
    console.log('Form data submitted:', formData);
  };

  return (
    <div style={{ backgroundColor: theme.colors.background }} className="min-h-screen py-10 px-4 md:px-8 flex justify-center items-start">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }} className="text-3xl font-bold mb-6 text-center">
          Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <SettingsSection title="Account Information">
            <InputField label="Username" name="username" value={formData.username} onChange={handleChange} />
            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
          </SettingsSection>

          <SettingsSection title="Change Password">
            <InputField name="currentPassword" type="password" placeholder="Current password" value={formData.currentPassword} onChange={handleChange} />
            <InputField name="newPassword" type="password" placeholder="New password" value={formData.newPassword} onChange={handleChange} />
            <InputField name="confirmNewPassword" type="password" placeholder="Confirm new password" value={formData.confirmNewPassword} onChange={handleChange} />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <CheckboxField label="Enable email notifications" name="notifications" checked={formData.notifications} onChange={handleChange} />
          </SettingsSection>

          <Button type="submit">Save Settings</Button>
        </form>
      </div>
    </div>
  );
};

const SettingsSection = ({ title, children }) => (
  <div>
    <h3 style={{ color: theme.colors.text, borderBottom: `1px solid ${theme.colors.border}` }} className="text-lg font-semibold mb-4 pb-2">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, ...props }) => (
  <div>
    {label && <label style={{ color: theme.colors.textSecondary }} className="block text-sm font-medium mb-1">{label}</label>}
    <input
      {...props}
      style={{
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
      }}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
    />
  </div>
);

const CheckboxField = ({ label, ...props }) => (
  <div className="flex items-center space-x-3">
    <input
      type="checkbox"
      {...props}
      style={{ accentColor: theme.colors.primary }}
      className="h-5 w-5 border-gray-300 rounded"
    />
    <label style={{ color: theme.colors.text }} className="font-medium">
      {label}
    </label>
  </div>
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      borderRadius: theme.borderRadius,
    }}
    className="w-full py-3 font-semibold rounded-md shadow-md hover:opacity-90 transition"
  >
    {children}
  </button>
);

export default Settings;