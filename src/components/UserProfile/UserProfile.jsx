import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile({ user }) {
  const navigate = useNavigate();
  console.log('user', user);
  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="user-profile" onClick={goToProfile}>
      <img
        src={user?.photo || user?.photoURL || 'default-avatar.png'}
        alt="User Avatar"
        className="user-avatar"
        width={40}
        height={40}
      />
      <div className="user-name">
        <span>{user?.firstName || 'Потребител'}</span>
        <span>{user?.lastName || ''}</span>
      </div>
    </div>
  );
}

export default UserProfile;
