// src/components/UserProfile/UserProfile.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Updated hook import
import './UserProfile.css'; // Import the CSS for styling

function UserProfile({ user }) {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  // Handle profile image click
  const goToProfile = () => {
    navigate('/profile'); // Redirect to the profile page
  };

  return (
    <div className="user-profile" onClick={goToProfile}>
      <img
        src={user.photo || 'default-avatar.png'} // Show user photo or default avatar
        alt="User Avatar"
        className="user-avatar"
        width={40}
        height={40}
      />
      {/* <span className="user-name">
        Влязъл като {user.firstName} {user.lastName}
      </span> */}
    </div>
  );
}

export default UserProfile;
