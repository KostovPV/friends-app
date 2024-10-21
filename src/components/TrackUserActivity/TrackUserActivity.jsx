import { analytics, db } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { doc, setDoc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';

function TrackUserActivity({ onStatisticsUpdate }) {
  const { user } = useAuthContext(); // Access the logged-in user

  useEffect(() => {
    const trackActivity = async () => {
      // Log page view event in Firebase Analytics
      logEvent(analytics, 'page_view');

      const startTime = Date.now();
      let timeSpent = 0;

      const handleUnload = async () => {
        const endTime = Date.now();
        timeSpent = (endTime - startTime) / 1000; 

        // Log time spent event in Firebase Analytics
        logEvent(analytics, 'time_spent', { time_spent_seconds: timeSpent });

        // Update the statistics in the parent component (Statistics)
        if (onStatisticsUpdate && typeof onStatisticsUpdate === 'function') {
          onStatisticsUpdate({
            timeSpent,
            isReturningUser: !!localStorage.getItem('isReturningUser'),
          });
        }

        // Store data in Firestore for the logged-in user
        if (user) {
          const userRef = doc(db, 'UserActivity', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            // Update existing user data
            await updateDoc(userRef, {
              total_time_spent: increment(timeSpent),
              page_views: increment(1),
              last_visit: new Date(),
            });
          } else {
            // Set new user data for the first time
            await setDoc(userRef, {
              email: user.email,
              total_time_spent: timeSpent,
              page_views: 1,
              last_visit: new Date(),
              isReturningUser: false,
            });
          }
        }
      };

      window.addEventListener('beforeunload', handleUnload);

      // Track returning visitors
      const isReturningUser = localStorage.getItem('isReturningUser');
      if (isReturningUser) {
        logEvent(analytics, 'returning_visitor');
      } else {
        localStorage.setItem('isReturningUser', 'true');
        logEvent(analytics, 'new_visitor');
      }

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    };

    trackActivity();
  }, [onStatisticsUpdate, user]);

  return null; // Invisible tracker component
}

export default TrackUserActivity;
