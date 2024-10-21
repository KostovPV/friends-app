import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import TrackUserActivity from '../../components/TrackUserActivity/TrackUserActivity';

export default function Statistics() {
  const [statistics, setStatistics] = useState({
    timeSpent: 0,
    isReturningUser: false,
  });

  const [allUsersStats, setAllUsersStats] = useState([]); // State to hold all users' data

  // Fetch all users' activity data from Firestore
  useEffect(() => {
    const fetchUserActivity = async () => {
      const querySnapshot = await getDocs(collection(db, 'UserActivity'));
      const userData = querySnapshot.docs.map((doc) => doc.data());
      setAllUsersStats(userData); // Store user data in state
    };

    fetchUserActivity();
  }, []);

  // Handle statistics update for the current user
  const handleStatisticsUpdate = (newStats) => {
    setStatistics((prevStats) => ({
      ...prevStats,
      ...newStats,
    }));
  };

  return (
    <div>
      <h2>User Activity Statistics</h2>

      {/* Display statistics for the current user */}
      <p>Total Time Spent on Page: {statistics.timeSpent} seconds</p>
      <p>
        Visitor Type: {statistics.isReturningUser ? 'Returning Visitor' : 'New Visitor'}
      </p>

      {/* Track User Activity for the current user */}
      <TrackUserActivity onStatisticsUpdate={handleStatisticsUpdate} />

      <h3>All Users Activity</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Total Time Spent (seconds)</th>
            <th>Page Views</th>
            <th>Last Visit</th>
            <th>Visitor Type</th>
          </tr>
        </thead>
        <tbody>
          {allUsersStats.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.total_time_spent}</td>
              <td>{user.page_views}</td>
              <td>{new Date(user.last_visit.seconds * 1000).toLocaleString()}</td>
              <td>{user.isReturningUser ? 'Returning' : 'New'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
