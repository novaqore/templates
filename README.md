# NovaQore Templates

Welcome to the NovaQore Templates repository. This collection of templates is designed to accelerate your development process by providing reusable, well-structured code for common features and functionalities.

## Table of Contents

1. [AppContext Template](#appcontext-template)
2. [NotificationContext Template](#notificationcontext-template)
3. [Firebase Security Rules](#firebase-security-rules)
4. [Future Template](#future-template)

## AppContext Template

The AppContext template provides a centralized state management solution using React's Context API, with built-in Firebase authentication integration.

### Implementation

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

```jsx
import { useApp } from '../context/AppContext';

function UserProfile() {
  const { user } = useApp();
  if (!user) return <div>Please log in</div>;
  return <div>Welcome, {user.displayName}</div>;
}
```

## NotificationContext Template

The NotificationContext template provides a reusable notification system with animated enter/exit effects.

### Implementation

```jsx
"use client"
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isLeaving: true } : notification
      )
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 500);
  }, []);

  const notify = useCallback(({ message, type = 'success', time = 3 }) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id, isLeaving: false }]);
    if (time > 0) {
      setTimeout(() => removeNotification(id), time * 1000);
    }
  }, [removeNotification]);

  useEffect(() => {
    // CSS animation styles are added here
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 overflow-hidden">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded shadow text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } ${notification.isLeaving ? 'notification-exit' : 'notification-enter'}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
```

### Usage

```jsx
import { useNotification } from '../context/NotificationContext';

function MyComponent() {
  const { notify } = useNotification();
  
  const handleClick = () => {
    notify({ message: 'Operation successful!', type: 'success' });
  };

  return <button onClick={handleClick}>Notify</button>;
}
```

## Firebase Security Rules

To ensure proper security in your Firebase project, you should set up appropriate security rules. Here's a basic set of rules that allows only authenticated users to read and write data:

```json
{
  "rules": {
    ".read": "auth != null",  // Only authenticated users can read
    ".write": "auth != null"  // Only authenticated users can write
  }
}
```

These rules should be placed in your Firebase project's security rules section. They ensure that all read and write operations require authentication, providing a basic level of security for your application.

## Future Template

This section is reserved for future templates that will be added to the NovaQore collection. Each new template will include basic implementation details and usage examples to help developers quickly understand and integrate these components into their projects.

---

This README will be updated as new templates are added to the NovaQore collection. Each template includes basic implementation details and usage examples to help developers quickly understand and integrate these components into their projects.
