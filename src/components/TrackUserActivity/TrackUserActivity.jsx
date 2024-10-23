import { analytics, db } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
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
      const startTime = Date.now(); // Store start time of the session

      const userRef = doc(db, 'UserActivity', user.uid);
      const userDoc = await getDoc(userRef);
      const isGoogleUser = user.providerData && user.providerData[0]?.providerId === 'google.com';

      // Final update when user leaves the page or app
      const handleUnload = async () => {
        const endTime = Date.now();
        const totalTimeSpent = (endTime - startTime) / 1000; // Total time spent in seconds during this session

        if (user) {
          const userRef = doc(db, 'UserActivity', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            // Update the document if it already exists
            await updateDoc(userRef, {
              total_time_spent: totalTimeSpent + (userDoc.data().total_time_spent || 0), // Add new session time to previous total
              page_views: (userDoc.data().page_views || 0) + 1, // Increment page views
              last_visit: new Date(), // Update last visit timestamp
            });
          } else {
            // Create a new document if it doesn't exist
            await setDoc(userRef, {
              email: user.email,
              total_time_spent: totalTimeSpent, // Store total session time
              page_views: 1,
              last_visit: new Date(),
              isReturningUser: !!localStorage.getItem('isReturningUser'),
              isGoogleSignedIn: isGoogleUser, // Mark if the user is signed in with Google
            });
          }
        }
      };

      // Add event listener to track when the user leaves or reloads the page
      window.addEventListener('beforeunload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleUnload); // Cleanup event listener when the component unmounts
      };
    };

    trackActivity();
  }, [user]);

  return null; // Invisible tracking component
}

export default TrackUserActivity;
