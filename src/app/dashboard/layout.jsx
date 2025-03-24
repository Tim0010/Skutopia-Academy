'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Quiz as QuizIcon,
  FlashOn as FlashcardIcon,
  People as MentorshipIcon,
  EmojiEvents as ScholarshipIcon,
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Article as ArticleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

const drawerWidth = 260;

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileData, setProfileData] = useState(null);
  const [openLearning, setOpenLearning] = useState(true);
  const [openResources, setOpenResources] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New course available: Advanced Mathematics', read: false },
    { id: 2, text: 'Your flashcard deck was shared 5 times', read: true },
    { id: 3, text: 'Mentorship session scheduled for tomorrow', read: false }
  ]);

  useEffect(() => {
    if (user?.id) {
      getProfileData();
    }
  }, [user]);

  const getProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error in getProfileData:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleToggleLearning = () => {
    setOpenLearning(!openLearning);
  };

  const handleToggleResources = () => {
    setOpenResources(!openResources);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  const learningMenuItems = [
    { text: 'Courses', icon: <SchoolIcon />, path: '/dashboard/courses' },
    { text: 'Lessons', icon: <BookIcon />, path: '/dashboard/lessons' },
  ];

  const resourceMenuItems = [
    { text: 'Quizzes', icon: <QuizIcon />, path: '/dashboard/quizzes' },
    { text: 'Flashcards', icon: <FlashcardIcon />, path: '/dashboard/flashcards' },
    { text: 'Subject Flashcards', icon: <BookIcon />, path: '/dashboard/flashcards/subjects' },
    { text: 'Past Examination Papers', icon: <ArticleIcon />, path: '/dashboard/exam-papers' },
    { text: 'Mentorship', icon: <MentorshipIcon />, path: '/dashboard/mentorship' },
    { text: 'Scholarships', icon: <ScholarshipIcon />, path: '/dashboard/scholarships' },
  ];

  const accountMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/dashboard/admin' },
  ];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box 
            component="img" 
            src="/assets/images/logo.png" 
            alt="Skutopia Logo" 
            sx={{ height: 32, width: 'auto' }} 
          />
          Skutopia Academy
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
            src={profileData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.full_name || user?.email || 'User')}&background=0E7C6B&color=fff`}
            alt={profileData?.full_name || user?.email || 'User'}
          />
          <Box sx={{ ml: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {profileData?.full_name || user?.user_metadata?.first_name || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 1 }}>
        <List component="nav" disablePadding>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: pathname === item.path ? 'inherit' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1, mx: 2 }} />

        {/* Learning Section */}
        <List component="nav" disablePadding>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleToggleLearning}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Learning
                  </Typography>
                } 
              />
              {openLearning ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openLearning} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {learningMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      pl: 4,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: pathname === item.path ? 'inherit' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">
                          {item.text}
                        </Typography>
                      } 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>

        {/* Resources Section */}
        <List component="nav" disablePadding>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleToggleResources}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <BookIcon />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Resources
                  </Typography>
                } 
              />
              {openResources ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openResources} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {resourceMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    selected={pathname === item.path || (item.path === '/dashboard/flashcards' && pathname.startsWith('/dashboard/flashcards'))}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      pl: 4,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: (pathname === item.path || (item.path === '/dashboard/flashcards' && pathname.startsWith('/dashboard/flashcards'))) ? 'inherit' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">
                          {item.text}
                        </Typography>
                      } 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>

        <Divider sx={{ my: 1, mx: 2 }} />

        {/* Account Section */}
        <List component="nav" disablePadding>
          {accountMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: pathname === item.path ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body2">
                      {item.text}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: 1,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            '&:hover': {
              bgcolor: 'error.main',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Sign Out
              </Typography>
            } 
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  const avatarUrl = profileData?.avatar_url || '';
  const displayName = profileData?.full_name || user?.email || '';

  // Find the current page title
  let currentPageTitle = 'Dashboard';

  // Check main menu items
  const mainMenuItem = mainMenuItems.find(item => item.path === pathname);
  if (mainMenuItem) {
    currentPageTitle = mainMenuItem.text;
  }

  // Check learning menu items
  const learningMenuItem = learningMenuItems.find(item => item.path === pathname);
  if (learningMenuItem) {
    currentPageTitle = learningMenuItem.text;
  }

  // Check resource menu items
  const resourceMenuItem = resourceMenuItems.find(item => item.path === pathname);
  if (resourceMenuItem) {
    currentPageTitle = resourceMenuItem.text;
  }

  // Check account menu items
  const accountMenuItem = accountMenuItems.find(item => item.path === pathname);
  if (accountMenuItem) {
    currentPageTitle = accountMenuItem.text;
  }

  // Special case for flashcards paths
  if (pathname.startsWith('/dashboard/flashcards')) {
    if (pathname === '/dashboard/flashcards') {
      currentPageTitle = 'Flashcards';
    } else if (pathname === '/dashboard/flashcards/subjects') {
      currentPageTitle = 'Subject Flashcards';
    } else if (pathname.match(/^\/dashboard\/flashcards\/[^\/]+$/)) {
      currentPageTitle = 'Flashcard Deck';
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {currentPageTitle}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton 
                color="primary"
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{ 
                  bgcolor: 'background.neutral',
                  '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton 
                color="primary"
                onClick={handleNotificationOpen}
                sx={{ 
                  bgcolor: 'background.neutral',
                  '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                }}
              >
                <Badge badgeContent={unreadNotificationsCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Help">
              <IconButton 
                color="primary"
                sx={{ 
                  bgcolor: 'background.neutral',
                  '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ 
                  ml: 1,
                  border: '2px solid',
                  borderColor: 'primary.light'
                }}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0E7C6B&color=fff`}
                  alt={displayName}
                >
                  {!avatarUrl && displayName?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary">Signed in as</Typography>
                <Typography variant="body1" fontWeight="500">{displayName}</Typography>
              </Box>
              <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/profile'); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/admin'); }}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon fontSize="small" />
                </ListItemIcon>
                Admin
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleMenuClose(); handleSignOut(); }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
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
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              boxShadow: 3
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.neutral',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 6, sm: 8 },
          px: { xs: 2, sm: 3 },
          mt: '64px', // Height of AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}