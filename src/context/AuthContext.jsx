// import { createContext, useReducer, useEffect } from 'react';
// import { auth } from '../firebaseConfig';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebaseConfig'; // Firestore instance

// export const AuthContext = createContext();

// export const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN':
//       return { ...state, user: action.payload };
//     case 'LOGOUT':
//       return { ...state, user: null };
//     case 'AUTH_IS_READY':
//       return { ...state, user: action.payload, authIsReady: true };
//     default:
//       return state;
//   }
// };

// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null,
//     authIsReady: false
//   });

//   useEffect(() => {
//     // Subscribe to auth state change
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const docRef = doc(db, 'Users', user.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           // Merge Firebase auth and Firestore user data
//           const mergedUser = {
//             ...user,
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             photoURL: userData.photo || user.photoURL // Prefer Firestore photo if available
//           };
//           dispatch({ type: 'AUTH_IS_READY', payload: mergedUser });
//         } else {
//           dispatch({ type: 'AUTH_IS_READY', payload: user });
//         }
//       } else {
//         dispatch({ type: 'AUTH_IS_READY', payload: null });
//       }
//     });

//     // Cleanup listener on unmount
//     return () => unsub();  // Keep the unsubscribe only on unmount
//   }, []);

//   return (
//     <AuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useReducer, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firestore instance

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    // Subscribe to Firebase Auth state change
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user data from the 'Users' collection in Firestore
          const docRef = doc(db, 'Users', user.uid); // Make sure 'Users' matches your Firestore collection name
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            
            // Merge Firebase auth data and Firestore user data
            const mergedUser = {
              ...user, // Auth properties like uid, email, etc.
              role: userData.role || 'user', // Default to 'user' if role is not set
              firstName: userData.firstName,
              lastName: userData.lastName,
              photoURL: userData.photo || user.photoURL, // Use Firestore photo if available
            };

            dispatch({ type: 'AUTH_IS_READY', payload: mergedUser });
          } else {
            // If no Firestore document exists, fallback to Firebase Auth data only
            dispatch({ type: 'AUTH_IS_READY', payload: user });
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
          dispatch({ type: 'AUTH_IS_READY', payload: user });
        }
      } else {
        dispatch({ type: 'AUTH_IS_READY', payload: null });
      }
    });

    // Cleanup subscription on unmount
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
