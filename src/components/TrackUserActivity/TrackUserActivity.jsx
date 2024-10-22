import { analytics, db } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { doc, setDoc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';

function TrackUserActivity() {
  const { user } = useAuthContext();

  useEffect(() => {
    logEvent(analytics, 'test_event'); // Manually trigger an event to test analytics

    if (!user || user.role === 'admin') {
      return; // Don't track admin activity
    }

    const trackActivity = async () => {
      logEvent(analytics, 'page_view');
      const startTime = Date.now();
      let timeSpent = 0;

      // Periodic update of time spent every 5 seconds
      const intervalId = setInterval(async () => {
        const currentTime = Date.now();
        timeSpent = (currentTime - startTime) / 1000;

        const userRef = doc(db, 'UserActivity', user.uid);
        const userDoc = await getDoc(userRef);

        const isGoogleUser = user.providerData && user.providerData[0]?.providerId === 'google.com';

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            total_time_spent: increment(timeSpent),
            page_views: increment(1),
            last_visit: new Date(),
          });
        } else {
          await setDoc(userRef, {
            email: user.email,
            total_time_spent: timeSpent,
            page_views: 1,
            last_visit: new Date(),
            isReturningUser: !!localStorage.getItem('isReturningUser'),
            isGoogleSignedIn: isGoogleUser, // Mark if the user is signed in with Google
          });
        }
      }, 5000); // Update every 5 seconds

      const handleUnload = async () => {
        clearInterval(intervalId); // Stop the interval when the user leaves
        const endTime = Date.now();
        timeSpent = (endTime - startTime) / 1000;

        if (user) {
          const userRef = doc(db, 'UserActivity', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            await updateDoc(userRef, {
              total_time_spent: increment(timeSpent),
              page_views: increment(1),
              last_visit: new Date(),
            });
          } else {
            await setDoc(userRef, {
              email: user.email,
              total_time_spent: timeSpent,
              page_views: 1,
              last_visit: new Date(),
              isReturningUser: !!localStorage.getItem('isReturningUser'),
              isGoogleSignedIn: isGoogleUser, // Mark if the user is signed in with Google
            });
          }
        }
      };

      window.addEventListener('beforeunload', handleUnload);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', handleUnload);
      };
    };

    trackActivity();
  }, [user]);

  return null; // Invisible tracking component
}

export default TrackUserActivity;
