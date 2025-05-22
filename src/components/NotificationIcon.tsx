/**import React, { useContext } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell } from 'lucide-react';

interface NotificationIconProps {
  onIconClick: () => void;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ onIconClick }) => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <button 
      onClick={onIconClick} 
      className="relative p-1 rounded-full hover:bg-slate-100"
    >
      <Bell size={22} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationIcon; **/
import React, { useContext } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell } from 'lucide-react';

interface NotificationIconProps {
  onIconClick: () => void;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ onIconClick }) => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <button 
      onClick={onIconClick} 
      className="relative p-1 rounded-full hover:bg-slate-100"
      aria-label={`Notifications (${unreadCount} unread)`}
    >
      <Bell size={22} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationIcon;