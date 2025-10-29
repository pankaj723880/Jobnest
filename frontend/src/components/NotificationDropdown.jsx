import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaCheck } from 'react-icons/fa';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
    const { notifications, unreadNotificationsCount, getNotifications, markNotificationRead, markAllNotificationsRead } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Fetch notifications on component mount
        getNotifications();
    }, [getNotifications]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            await markNotificationRead(notification._id);
        }
        // Here you could navigate to the relevant page based on notification type
        // For now, just close the dropdown
        setIsOpen(false);
    };

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-dropdown" ref={dropdownRef}>
            <button
                className="notification-button"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <FaBell />
                {unreadNotificationsCount > 0 && (
                    <span className="notification-badge">{unreadNotificationsCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-menu">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadNotificationsCount > 0 && (
                            <button
                                className="mark-all-read-btn"
                                onClick={handleMarkAllRead}
                                title="Mark all as read"
                            >
                                <FaCheck /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-date">
                                            {formatDate(notification.createdAt)}
                                        </div>
                                    </div>
                                    {!notification.isRead && <div className="unread-indicator"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
