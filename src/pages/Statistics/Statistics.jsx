import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './Statistics.css';

export default function Statistics() {
  const [allUsersStats, setAllUsersStats] = useState([]);
  const [summary, setSummary] = useState({
    totalTimeSpent: 0,
    averageTimeSpent: 0,
    totalPageViews: 0,
    newUsersCount: 0,
    returningUsersCount: 0,
    totalRegisteredUsersCount: 0, // Track normal registered users
    totalGoogleUsersCount: 0, // Track Google signed-in users
  });

  // Fetch all users' activity data from Firestore
  useEffect(() => {
    const fetchUserActivity = async () => {
      const querySnapshot = await getDocs(collection(db, 'UserActivity'));
      const userData = querySnapshot.docs.map((doc) => doc.data());
      
      setAllUsersStats(userData);
      calculateSummary(userData);
    };

    fetchUserActivity();
  }, []);

  // Convert time spent to minutes or hours
  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${Math.round(minutes)} min`;
  };

  // Calculate summary stats like total time spent, average time, total registered users, etc.
  const calculateSummary = (userData) => {
    let totalTimeSpent = 0;
    let totalPageViews = 0;
    let newUsersCount = 0;
    let returningUsersCount = 0;
    let totalRegisteredUsersCount = 0;
    let totalGoogleUsersCount = 0;

    userData.forEach((user) => {
      totalTimeSpent += user.total_time_spent || 0;
      totalPageViews += user.page_views || 0;

      if (user.isReturningUser) {
        returningUsersCount += 1;
      } else {
        newUsersCount += 1;
      }

      // Distinguish between registered and Google-signed-in users
      if (user.isGoogleSignedIn) {
        totalGoogleUsersCount += 1;
      } else {
        totalRegisteredUsersCount += 1;
      }
    });

    const averageTimeSpent = totalTimeSpent / userData.length;

    setSummary({
      totalTimeSpent,
      averageTimeSpent: averageTimeSpent.toFixed(2),
      totalPageViews,
      newUsersCount,
      returningUsersCount,
      totalRegisteredUsersCount, // Set total registered users
      totalGoogleUsersCount, // Set total Google signed-in users
    });
  };

  return (
    <div>
      <h2>Website User Statistics</h2>

      <h3>Summary</h3>
      <p>Total Time Spent: {formatTime(summary.totalTimeSpent)}</p>
      <p>Average Time Spent per User: {formatTime(summary.averageTimeSpent)}</p>
      <p>Total Page Views: {summary.totalPageViews}</p>
      <p>New Users: {summary.newUsersCount}</p>
      <p>Returning Users: {summary.returningUsersCount}</p>
      <p>Total Registered Users: {summary.totalRegisteredUsersCount}</p> {/* Display total registered users */}
      <p>Total Google Signed-In Users: {summary.totalGoogleUsersCount}</p> {/* Display total Google signed-in users */}

      <h3>All Users Activity</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Total Time Spent</th>
            <th>Page Views</th>
            <th>Last Visit</th>
            <th>Visitor Type</th>
          </tr>
        </thead>
        <tbody>
          {allUsersStats.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{formatTime(user.total_time_spent)}</td>
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
