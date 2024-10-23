import { analytics, db } from '../../firebaseConfig';
import { logEvent } from 'firebase/analytics';
import { useEffect } from 'react';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../hooks/useAuthContext';

function TrackUserActivity() {
    const { user } = useAuthContext();

    useEffect(() => {
        if (!user || user.role === 'admin') {
            return; // Don't track admin activity
        }

        // Track page view
        logEvent(analytics, 'page_view');

        // Capture the time when the session starts
        const startTime = Date.now();
        
        const trackActivity = async () => {
            const userRef = doc(db, 'UserActivity', user.uid);
            const userDoc = await getDoc(userRef);
            const isGoogleUser = user.providerData && user.providerData[0]?.providerId === 'google.com';

            if (!userDoc.exists()) {
                // If it's the user's first visit, create a new document in Firestore
                await setDoc(userRef, {
                    email: user.email,
                    total_time_spent: 0,  // Start with 0 time spent
                    page_views: 1,  // Initialize page views
                    last_visit: new Date(),
                    isReturningUser: !!localStorage.getItem('isReturningUser'),
                    isGoogleSignedIn: isGoogleUser,
                });
            } else {
                // If the user document exists, just update page views and last visit
                await updateDoc(userRef, {
                    page_views: userDoc.data().page_views + 1,  // Increment page views
                    last_visit: new Date(),
                });
            }
        };

        // Update Firestore when the user leaves or the page unloads
        const handleUnload = async () => {
            const endTime = Date.now();
            const timeSpentInSeconds = (endTime - startTime) / 1000;  // Calculate total time spent in seconds
            
            if (user) {
                const userRef = doc(db, 'UserActivity', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    // Update the total time spent by adding this session's time
                    await updateDoc(userRef, {
                        total_time_spent: userDoc.data().total_time_spent + timeSpentInSeconds,
                        last_visit: new Date(),
                    });
                } else {
                    // If the user document doesn't exist, create it (just in case)
                    await setDoc(userRef, {
                        email: user.email,
                        total_time_spent: timeSpentInSeconds,
                        page_views: 1,
                        last_visit: new Date(),
                        isReturningUser: !!localStorage.getItem('isReturningUser'),
                        isGoogleSignedIn: user.providerData[0]?.providerId === 'google.com',
                    });
                }
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        // Track the user activity when they log in or navigate pages
        trackActivity();

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [user]);

    return null;  // Invisible tracking component
}

export default TrackUserActivity;
