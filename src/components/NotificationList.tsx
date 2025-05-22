/**import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Check, X } from 'lucide-react';

const NotificationList: React.FC = () => {
  const { notifications, markAsRead, clearNotifications } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg w-80 p-4">
        <div className="text-center text-slate-500">
          <Bell size={24} className="mx-auto mb-2 text-slate-400" />
          <p>No notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-80 max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[60vh]">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
              notification.read ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <p className={`text-sm ${notification.read ? 'text-slate-500' : 'text-slate-900'}`}>
                {notification.message}
              </p>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-2 text-slate-400 hover:text-slate-600"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;**/
import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Check, X, CheckCheck } from 'lucide-react';

const NotificationList: React.FC = () => {
  const { notifications, markAsRead, clearNotifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg w-80 p-4">
        <div className="text-center text-slate-500">
          <Bell size={24} className="mx-auto mb-2 text-slate-400" />
          <p>No notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-80 max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notifications</h3>
          <span className="text-sm text-slate-500">{unreadCount} unread</span>
        </div>
        <div className="flex justify-between items-center">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center"
            >
              <CheckCheck size={14} className="mr-1" />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center ml-auto"
            >
              <X size={14} className="mr-1" />
              Clear all
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[60vh] divide-y divide-slate-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-slate-50 transition-colors ${
              notification.read ? 'opacity-75' : 'bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className={`text-sm ${notification.read ? 'text-slate-500' : 'text-slate-900'}`}>
                {notification.message}
              </p>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;