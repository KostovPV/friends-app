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
    totalRegisteredUsersCount: 0,
    totalGoogleUsersCount: 0,
    totalUsers: 0, 
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
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes} min`;
  };

  
  const calculateSummary = (userData) => {
    let totalTimeSpentInSeconds = 0;
    let totalPageViews = 0;
    let newUsersCount = 0;
    let returningUsersCount = 0;
    let totalRegisteredUsersCount = 0;
    let totalGoogleUsersCount = 0;

    userData.forEach((user) => {
      totalTimeSpentInSeconds += user.total_time_spent || 0;
      totalPageViews += user.page_views || 0;

      if (user.isReturningUser) {
        returningUsersCount += 1;
      } else {
        newUsersCount += 1;
      }

      if (user.isGoogleSignedIn) {
        totalGoogleUsersCount += 1;
      } else {
        totalRegisteredUsersCount += 1;
      }
    });

    const averageTimeSpentInSeconds = totalTimeSpentInSeconds / userData.length;

    setSummary({
      totalTimeSpent: totalTimeSpentInSeconds,
      averageTimeSpent: averageTimeSpentInSeconds.toFixed(2),
      totalPageViews,
      newUsersCount,
      returningUsersCount,
      totalRegisteredUsersCount,
      totalGoogleUsersCount,
      totalUsers: totalRegisteredUsersCount + totalGoogleUsersCount, 
    });
  };

  return (
    <div className='statistics-container'>
      <h2>Обобщена статистика за сайта</h2>

      <h3>Подробности</h3>
      <p>Общо време прекарано: {formatTime(summary.totalTimeSpent)}</p>
      <p>Средно време за потребител: {formatTime(summary.averageTimeSpent)}</p>
      <p>Общо посещения на страници: {summary.totalPageViews}</p>
      <p>Нови потребители: {summary.newUsersCount}</p>
      <p>Стари потребители: {summary.returningUsersCount}</p>
      <p>Регистрирани потребители: {summary.totalRegisteredUsersCount}</p>
      <p>Потребители влезли с Google account: {summary.totalGoogleUsersCount}</p>
      <p>Общо потребители: {summary.totalUsers}</p> 

      <h3>Активнист на всички потребители</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Общо прекарано време</th>
            <th>Посещения на страници</th>
            <th>Последно влизане</th>
            <th>Тип посетител</th>
          </tr>
        </thead>
        <tbody>
          {allUsersStats.map((user, index) => (
            <tr key={index}>
              <td>
                <strong>{user.email}</strong>
              </td>
              <td>{formatTime(user.total_time_spent)}</td>
              <td>{user.page_views}</td>
              <td>{new Date(user.last_visit.seconds * 1000).toLocaleString()}</td>
              <td>{user.isReturningUser ? 'Стар' : 'Нов'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
