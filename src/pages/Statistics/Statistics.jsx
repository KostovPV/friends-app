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
    totalUsersCount: 0, // New field for total registered users
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

    userData.forEach((user) => {
      totalTimeSpent += user.total_time_spent || 0;
      totalPageViews += user.page_views || 0;
      if (user.isReturningUser) {
        returningUsersCount += 1;
      } else {
        newUsersCount += 1;
      }
    });

    const averageTimeSpent = totalTimeSpent / userData.length;
    const totalUsersCount = userData.length; // Total number of registered users

    setSummary({
      totalTimeSpent,
      averageTimeSpent: averageTimeSpent.toFixed(2),
      totalPageViews,
      newUsersCount,
      returningUsersCount,
      totalUsersCount, // Set the total users count
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
      <p>Total Registered Users: {summary.totalUsersCount}</p> {/* Display total registered users */}

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
