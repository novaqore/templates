"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onValue, ref } from 'firebase/database';
import { auth, db } from '../libs/firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const usersRef = ref(db, 'users/' + firebaseUser.uid);
        onValue(usersRef, (snapshot) => {
          const databaseUser = snapshot.val();
          setUser({ ...firebaseUser, ...databaseUser });
        });
      } else {
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};
