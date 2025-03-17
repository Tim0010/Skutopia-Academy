import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import SvgIcon from './SvgIcon';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
    { title: 'Dashboard', icon: 'tabler-dashboard', path: '/dashboard' },
    { title: 'Courses', icon: 'tabler-book', path: '/courses' },
    { title: 'Flashcards', icon: 'tabler-cards', path: '/flashcards' },
    { title: 'Mentorship', icon: 'tabler-users', path: '/mentorship' },
    { title: 'Scholarships', icon: 'tabler-award', path: '/scholarships' }
];

export default function Navigation() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Skutopia Academy
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.title}
                        onClick={() => {
                            router.push(item.path);
                            if (isMobile) setMobileOpen(false);
                        }}
                    >
                        <ListItemIcon>
                            <SvgIcon name={item.icon} />
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <SvgIcon name="tabler-menu-2" />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    {user && (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleMenuClick}
                                sx={{ p: 0.5 }}
                            >
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0)}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                onClick={handleMenuClose}
                            >
                                <MenuItem>
                                    <ListItemIcon>
                                        <SvgIcon name="tabler-user" />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <SvgIcon name="tabler-settings" />
                                    </ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleSignOut}>
                                    <ListItemIcon>
                                        <SvgIcon name="tabler-logout" />
                                    </ListItemIcon>
                                    <ListItemText primary="Sign Out" />
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
} 