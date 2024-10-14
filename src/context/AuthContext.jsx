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
    authIsReady: false
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Ensure photoURL is consistent
          const mergedUser = { 
            ...user, 
            firstName: userData.firstName, 
            lastName: userData.lastName, 
            photoURL: userData.photo || user.photoURL // Prefer Firestore photo if available
          };
          dispatch({ type: 'AUTH_IS_READY', payload: mergedUser });
        } else {
          // Fallback to auth data if Firestore data is unavailable
          dispatch({ type: 'AUTH_IS_READY', payload: user });
        }
      } else {
        dispatch({ type: 'AUTH_IS_READY', payload: null });
      }
      unsub(); 
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
