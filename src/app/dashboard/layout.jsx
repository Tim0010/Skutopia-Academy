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
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileData, setProfileData] = useState(null);
  const [openLearning, setOpenLearning] = useState(true);
  const [openResources, setOpenResources] = useState(true);

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

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  const learningMenuItems = [
    { text: 'Courses', icon: <SchoolIcon />, path: '/dashboard/courses' },
    { text: 'Lessons', icon: <BookIcon />, path: '/dashboard/lessons' },
    { text: 'Quizzes', icon: <QuizIcon />, path: '/dashboard/quizzes' },
  ];

  const resourceMenuItems = [
    { text: 'Flashcards', icon: <FlashcardIcon />, path: '/dashboard/flashcards' },
    { text: 'Mentorship', icon: <MentorshipIcon />, path: '/dashboard/mentorship' },
    { text: 'Scholarships', icon: <ScholarshipIcon />, path: '/dashboard/scholarships' },
  ];

  const accountMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, path: '/dashboard/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Skutopia Academy
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      {/* Learning Section */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleToggleLearning}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Learning" />
            {openLearning ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openLearning} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {learningMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => router.push(item.path)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      {/* Resources Section */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleToggleResources}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Resources" />
            {openResources ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openResources} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {resourceMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={pathname === item.path}
                  onClick={() => router.push(item.path)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      <Divider />

      {/* Account Section */}
      <List>
        {accountMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
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

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentPageTitle}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`}
              alt={displayName}
            >
              {!avatarUrl && displayName?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/profile'); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); router.push('/dashboard/settings'); }}>
              Settings
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleSignOut(); }}>
              Sign Out
            </MenuItem>
          </Menu>
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 