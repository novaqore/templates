"use client"
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

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
            setTimeout(() => {
                removeNotification(id);
            }, time * 1000);
        }
    }, [removeNotification]);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromRight {
                0% {
                    transform: translateX(100%);
                    opacity: 0;
                }
                100% {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutToRight {
                0% {
                    transform: translateX(0);
                    opacity: 1;
                }
                100% {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .notification-enter {
                animation: slideInFromRight 0.5s forwards;
            }

            .notification-exit {
                animation: slideOutToRight 0.5s forwards;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
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
