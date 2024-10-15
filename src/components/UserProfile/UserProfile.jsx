import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile({ user }) {
  const navigate = useNavigate();
  console.log('user', user)
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
      <span className="user-name">
        Влязъл като {user?.firstName || 'Потребител'} {user?.lastName || ''}
      </span>
    </div>
  );
}

export default UserProfile;