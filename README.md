# NovaQore Templates

Welcome to the NovaQore Templates repository. This collection of templates is designed to accelerate your development process by providing reusable, well-structured code for common features and functionalities.

## Table of Contents

1. [AppContext Template](#appcontext-template)
2. [Future Template 1](#future-template-1)
3. [Future Template 2](#future-template-2)

## AppContext Template

The AppContext template provides a centralized state management solution using React's Context API, with built-in Firebase authentication integration.

### Implementation

#### AppContext.js

```jsx
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

export const useApp = () => useContext(AppContext);
```

### Usage

#### In Components

```jsx
import { useApp } from '../context/AppContext';

function UserProfile() {
  const { user } = useApp();

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>User Role: {user.role}</p>
    </div>
  );
}
```

#### Wrapping Your Application

In your root layout (e.g., `layout.js`):

```jsx
import { AppProvider } from './context/AppContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
```

### Key Points

- Manages user authentication state and syncs with Firebase
- Use the `useApp` hook to access user data in any component
- The user object contains both Firebase auth data and additional data from the Realtime Database

### Customization

Extend the AppContext by adding more state or functions to the context value:

```jsx
const [additionalState, setAdditionalState] = useState(initialValue);

// In the provider value:
<AppContext.Provider value={{ user, additionalState, setAdditionalState }}>
```

Remember to update the `useApp` hook's return type if you modify the context value.

## Future Template 1

[Placeholder for future template documentation]

## Future Template 2

[Placeholder for future template documentation]

---

This README will be updated as new templates are added to the NovaQore collection. Each template will include implementation details, usage examples, and customization guidelines.
