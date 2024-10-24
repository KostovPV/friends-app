import { analytics, db } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { useEffect, useRef, useState } from 'react';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';

function TrackUserActivity() {
  const { user } = useAuthContext();
  const [isTracking, setIsTracking] = useState(false); // Flag to prevent multiple tracking calls
  const startTimeRef = useRef(null); // Use useRef to keep the session start time consistent

  useEffect(() => {
    // Check if the user is not authenticated or if it is an admin
    if (!user) {
      console.log("No user detected, waiting for authentication...");
      return; // Wait until user is authenticated
    }

    if (user.role === 'admin') {
      console.log("Admin detected, skipping tracking.");
      return; // Don't track admin activity
    }

    // Prevent multiple tracking when already tracking
    if (isTracking) return;

    // Mark as tracking
    setIsTracking(true);

    // Track page view event in analytics
    logEvent(analytics, 'page_view');
    startTimeRef.current = Date.now(); // Set start time
    console.log("Session started at:", startTimeRef.current);

    const trackActivity = async () => {
      const userRef = doc(db, 'UserActivity', user.uid);
      const userDoc = await getDoc(userRef);
      const isGoogleUser = user.providerData && user.providerData[0]?.providerId === 'google.com';

      try {
        if (!userDoc.exists()) {
          console.log("New user activity created");
          await setDoc(userRef, {
            email: user.email,
            total_time_spent: 0,
            page_views: 1,
            last_visit: new Date(),
            isReturningUser: !!localStorage.getItem('isReturningUser'),
            isGoogleSignedIn: isGoogleUser,
          });
        } else {
          console.log("Updating existing user activity");
          const updatePromise = updateDoc(userRef, {
            page_views: userDoc.data().page_views + 1,
            last_visit: new Date(),
          });
          await updatePromise; // Wait for the update to finish
          console.log("Existing user activity updated");
        }
      } catch (error) {
        console.error("Error tracking activity:", error);
      }
    };

    const handleUnload = async () => {
      const endTime = Date.now();
      const timeSpentInSeconds = (endTime - startTimeRef.current) / 1000;
      console.log('Session ended at:', endTime);
      console.log('Time spent in this session (seconds):', timeSpentInSeconds);

      if (user) {
        const userRef = doc(db, 'UserActivity', user.uid);
        const userDoc = await getDoc(userRef);

        try {
          if (userDoc.exists()) {
            console.log("Updating total time spent");
            await updateDoc(userRef, {
              total_time_spent: userDoc.data().total_time_spent + timeSpentInSeconds,
              last_visit: new Date(),
            });
          } else {
            console.log("Creating new document with total time spent");
            await setDoc(userRef, {
              email: user.email,
              total_time_spent: timeSpentInSeconds,
              page_views: 1,
              last_visit: new Date(),
              isReturningUser: !!localStorage.getItem('isReturningUser'),
              isGoogleSignedIn: isGoogleUser,
            });
          }
        } catch (error) {
          console.error("Error updating total time spent:", error);
        }
      }

      setIsTracking(false); // Reset tracking state after unload
    };

    // Attach event listeners for page unload or tab change
    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnload();
      }
    });

    // Track the activity once on component mount
    trackActivity();

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleUnload);
    };
  }, [user, isTracking]);

  return null;
}

export default TrackUserActivity;