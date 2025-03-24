'use client';

import { useState } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Tooltip,
    CircularProgress,
    Paper
} from '@mui/material';
import SvgIcon from './SvgIcon';
import { useNotifications } from '@/contexts/NotificationContext';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

// Icon mapping for notification types
const typeIcons = {
    info: 'tabler-info-circle',
    success: 'tabler-check-circle',
    warning: 'tabler-alert-triangle',
    error: 'tabler-alert-circle'
};

// Color mapping for notification types
const typeColors = {
    info: 'primary.main',
    success: 'success.main',
    warning: 'warning.main',
    error: 'error.main'
};

export default function NotificationCenter() {
    const router = useRouter();
    const { 
        notifications, 
        unreadCount, 
        loading, 
        markAsRead, 
        markAllAsRead 
    } = useNotifications();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        console.log("Notifications:", notifications); // Debug log
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        
        // Close the menu
        handleClose();
    };
    
    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };
    
    return (
        <>
            <Tooltip title="Notifications">
                <IconButton
                    color="inherit"
                    onClick={handleOpen}
                    size="large"
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <SvgIcon icon="tabler-bell" />
                    </Badge>
                </IconButton>
            </Tooltip>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 320,
                        maxHeight: 500,
                        overflow: 'auto'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllAsRead}>
                            Mark all as read
                        </Button>
                    )}
                </Box>
                
                <Divider />
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No notifications
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification) => (
                            <Box key={notification.id}>
                                <ListItem 
                                    button 
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                                        '&:hover': {
                                            bgcolor: notification.is_read ? 'action.hover' : 'action.selected'
                                        }
                                    }}
                                >
                                    <Box sx={{ mr: 2, color: typeColors[notification.type] || 'primary.main' }}>
                                        <SvgIcon icon={typeIcons[notification.type] || 'tabler-info-circle'} />
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" noWrap>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary" 
                                                    sx={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : 'Just now'}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                )}
            </Menu>
        </>
    );
}
