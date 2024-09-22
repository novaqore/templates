# NovaQore AppContext Documentation

## Overview

The AppContext is a crucial part of the NovaQore template, providing a centralized state management solution using React's Context API. It manages user authentication state and synchronizes it with Firebase, making it easy to access user information throughout the application.

## Key Components

### 1. AppContext.js

This file contains the main context logic:

- `AppContext`: Created using `createContext()`.
- `AppProvider`: A component that wraps the application and provides the context.
- `useApp`: A custom hook for consuming the AppContext.

### 2. layout.js

This file sets up the root layout of the application and wraps it with the `AppProvider`.

## How It Works

1. **Context Creation**: The `AppContext` is created using React's `createContext()`.

2. **State Management**: The `AppProvider` component manages the user state using the `useState` hook.

3. **Authentication Listening**: In the `useEffect` hook, we set up a listener for authentication state changes using Firebase's `onAuthStateChanged`.

4. **User Data Synchronization**: When a user is authenticated, we fetch additional user data from the Firebase Realtime Database and merge it with the authentication data.

5. **Context Provision**: The merged user data is provided to the entire application through the `AppContext.Provider`.

6. **Context Consumption**: Components can access the user data using the `useApp` custom hook.

## Usage Examples

### Wrapping Your Application

In your root component or pages/_app.js:

```jsx
import { AppProvider } from './context/AppContext';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
```

### Accessing User Data in Components

In any component where you need access to the user data:

```jsx
import { useApp } from '../context/AppContext';

function UserProfile() {
  const { user } = useApp();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      {/* Access any additional user data from the database */}
      <p>User Role: {user.role}</p>
    </div>
  );
}
```

### Conditional Rendering Based on Auth State

```jsx
import { useApp } from '../context/AppContext';

function Navigation() {
  const { user } = useApp();

  return (
    <nav>
      {user ? (
        <button>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </nav>
  );
}
```

## Best Practices

1. Always use the `useApp` hook to access the context, rather than using `useContext(AppContext)` directly.
2. Keep the AppContext focused on global application state. For component-specific state, use local state management.
3. Be mindful of unnecessary re-renders. The AppContext updates can trigger re-renders in all consuming components.

## Customization

You can extend the AppContext to include additional global state or functions as needed. For example, you might want to add theme preferences, language settings, or global error handling.

```jsx
const [theme, setTheme] = useState('light');

// ... in the provider value:
<AppContext.Provider value={{ user, theme, setTheme }}>
```

Remember to update the `useApp` hook's return type if you modify the context value.

## Conclusion

The AppContext provides a powerful and flexible way to manage global state in your NovaQore application, with a focus on user authentication and data. By leveraging this context, you can easily access user information across your application, creating a seamless and responsive user experience.
