'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Load notifications when user logs in
    useEffect(() => {
        if (user) {
            loadNotifications();
            
            // Set up real-time subscription for new notifications
            const channel = supabase
                .channel('public:simple_notifications')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'simple_notifications',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    console.log('New notification received:', payload);
                    // Add new notification to state
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                })
                .subscribe();
                
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);
    
    // Load notifications from database
    const loadNotifications = async () => {
        setLoading(true);
        try {
            console.log('Loading notifications for user:', user.id);
            
            // Get notifications for current user
            const { data, error } = await supabase
                .from('simple_notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);
                
            if (error) {
                console.error('Error fetching notifications:', error);
                throw error;
            }
            
            console.log('Notifications loaded:', data);
            setNotifications(data || []);
            
            // Count unread notifications
            const unread = data ? data.filter(n => !n.is_read).length : 0;
            setUnreadCount(unread);
        } catch (err) {
            console.error('Error loading notifications:', err);
            // Set empty notifications instead of leaving in loading state
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };
    
    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('simple_notifications')
                .update({ is_read: true })
                .eq('id', notificationId);
                
            if (error) throw error;
            
            // Update local state
            setNotifications(notifications.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, is_read: true } 
                    : notification
            ));
            
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };
    
    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('simple_notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
                
            if (error) throw error;
            
            // Update local state
            setNotifications(notifications.map(notification => ({ ...notification, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };
    
    // Create a notification (admin function)
    const createNotification = async (userId, title, message, type) => {
        try {
            console.log('Creating notification for user:', userId);
            
            const notification = { 
                user_id: userId,
                title,
                message,
                type,
                is_read: false,
                created_at: new Date().toISOString()
            };
            
            const { data, error } = await supabase
                .from('simple_notifications')
                .insert([notification])
                .select();
                
            if (error) throw error;
            
            console.log('Notification created:', data);
            return { success: true, notification: data?.[0] };
        } catch (err) {
            console.error('Error creating notification:', err);
            return { success: false, error: err.message };
        }
    };
    
    // Create notifications for multiple users
    const createBulkNotifications = async (userIds, title, message, type) => {
        try {
            const notifications = userIds.map(userId => ({
                user_id: userId,
                title,
                message,
                type,
                is_read: false,
                created_at: new Date().toISOString()
            }));
            
            const { error } = await supabase
                .from('simple_notifications')
                .insert(notifications);
                
            if (error) throw error;
            
            return { success: true };
        } catch (err) {
            console.error('Error creating bulk notifications:', err);
            return { success: false, error: err.message };
        }
    };
    
    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
                createNotification,
                createBulkNotifications,
                refreshNotifications: loadNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
