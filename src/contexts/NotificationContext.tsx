/** import React, { createContext, useState, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      message,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};**/
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to order status changes
    const orderSubscription = supabase
      .channel('order_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: user.isAdmin ? undefined : `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { old: oldOrder, new: newOrder } = payload;
          if (oldOrder.status !== newOrder.status) {
            const message = `Order #${newOrder.id.slice(0, 8)} status updated to ${newOrder.status}`;
            addNotification(message);
          }
        }
      )
      .subscribe();

    // Subscribe to product changes (for admin only)
    let productSubscription;
    if (user.isAdmin) {
      productSubscription = supabase
        .channel('product_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
          },
          (payload) => {
            let message = '';
            switch (payload.eventType) {
              case 'INSERT':
                message = `New product added: ${payload.new.name}`;
                break;
              case 'UPDATE':
                message = `Product updated: ${payload.new.name}`;
                break;
              case 'DELETE':
                message = `Product deleted: ${payload.old.name}`;
                break;
            }
            if (message) {
              addNotification(message);
            }
          }
        )
        .subscribe();
    }

    return () => {
      orderSubscription.unsubscribe();
      if (productSubscription) {
        productSubscription.unsubscribe();
      }
    };
  }, [user]);

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: uuidv4(),
      message,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Ignore audio play errors
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};