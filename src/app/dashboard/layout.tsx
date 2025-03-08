"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  useTheme,
  styled,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsOutlinedIcon,
  Home as HomeOutlinedIcon,
  Work as WorkOutlinedIcon,
  Business as BusinessOutlinedIcon,
  Chat as ChatOutlinedIcon,
  Settings as SettingsOutlinedIcon,
  Translate as TranslateOutlinedIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as ExitToAppIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Navigation from "@/components/navigation/Navigation";

const drawerWidth = 260;


const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 25,
  backgroundColor: "#FFFFFF",
  border: "1px solid #E0E0E0",
  width: "100%",
  maxWidth: 800,
  marginLeft: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    marginLeft: theme.spacing(1),
    maxWidth: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#4CAF50",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#212121",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    "&::placeholder": {
      color: "#9E9E9E",
      opacity: 1,
    },
  },
}));

const NavButton = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "white",
  padding: theme.spacing(0, 1.5),
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0, 1),
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MobileNavButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: 1,
  "& span": {
    color: theme.palette.primary.main,
  },
}));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 40,
  margin: theme.spacing(0, 2),
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  [theme.breakpoints.down("md")]: {
    margin: theme.spacing(0, 1),
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 280,
    backgroundColor: "#FFFFFF",
  },
}));


const AvatarWithMenu = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 40,
  height: 40,
  borderRadius: '50%',
  overflow: 'visible',
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [topNavOpen, setTopNavOpen] = useState(false);


  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "TOGGLE_DRAWER") {
        handleDrawerToggle();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTopNavToggle = () => {
    setTopNavOpen(!topNavOpen);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const mobileMenu = (
    <MobileDrawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { width: drawerWidth },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src="/profile-image.jpg"
              alt="User Profile"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">Ahmed Amaar</Typography>
              <Typography variant="body2" color="text.secondary">
                UX UI designer
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <WorkOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Jobs" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <BusinessOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Employers" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <NotificationsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ChatOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Messaging" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <SettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Settings and privacy" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <TranslateOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Language" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </MobileDrawer>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "#1A1A1A",
          color: "white",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64, justifyContent: "space-between" }}>
          {/* Mobile view - Avatar with menu on left, iZAM on right */}
          {isMobile && (
            <>
              <AvatarWithMenu onClick={handleTopNavToggle}>
                <Avatar
                  src="/profile-image.jpg"
                  alt="User Profile"
                  sx={{ 
                    width: 40, 
                    height: 40,
                    cursor: 'pointer'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MenuIcon sx={{ color: 'black', fontSize: 14 }} />
                </Box>
              </AvatarWithMenu>
              
              <Logo variant="h6">
                i<span>Z</span>AM
              </Logo>
            </>
          )}
          
          {/* Desktop view - Logo and search on left, navigation on right */}
          {!isMobile && (
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Logo variant="h6">
                  i<span>Z</span>AM
                </Logo>

                <SearchBar>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search by name, job title, ..."
                    inputProps={{ "aria-label": "search" }}
                  />
                </SearchBar>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <NavButton>
                  <HomeOutlinedIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="caption">Home</Typography>
                </NavButton>

                <NavButton>
                  <WorkOutlinedIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="caption">Jobs</Typography>
                </NavButton>

                <NavButton>
                  <BusinessOutlinedIcon sx={{ color: "text.secondary" }} />
                  <Typography variant="caption">Employers</Typography>
                </NavButton>

                <VerticalDivider orientation="vertical" flexItem />

                <NavButton>
                  <Badge
                    badgeContent={1}
                    color="error"
                    sx={{ "& .MuiBadge-badge": { top: 2, right: 2 } }}
                  >
                    <NotificationsOutlinedIcon sx={{ color: "text.secondary" }} />
                  </Badge>
                  <Typography variant="caption">Notifications</Typography>
                </NavButton>

                <NavButton>
                  <Badge
                    badgeContent={1}
                    color="error"
                    sx={{ "& .MuiBadge-badge": { top: 2, right: 2 } }}
                  >
                    <ChatOutlinedIcon sx={{ color: "text.secondary" }} />
                  </Badge>
                  <Typography variant="caption">Messaging</Typography>
                </NavButton>

                <NavButton onClick={handleProfileClick}>
                  <Avatar
                    src="/profile-image.jpg"
                    alt="User Profile"
                    sx={{ width: 32, height: 32 }}
                  />
                  <Typography variant="caption">Profile</Typography>
                </NavButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 240,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            borderRadius: 2,
            "& .MuiAvatar-root": {
              width: 56,
              height: 56,
              ml: 1,
              mr: 2,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem sx={{ py: 2 }}>
          <Avatar src="/profile-image.jpg" />
          <Box>
            <Typography variant="subtitle1">Ahmed Amaar</Typography>
            <Typography variant="body2" color="text.secondary">
              UX UI designer
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 1.5 }}>
          <SettingsOutlinedIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body1">Setting and privacy</Typography>
        </MenuItem>
        <MenuItem sx={{ py: 1.5 }}>
          <TranslateOutlinedIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body1">Language</Typography>
        </MenuItem>
        <MenuItem sx={{ py: 1.5 }}>
          <HelpOutlineIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body1">Help</Typography>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 1.5, color: "error.main" }}>
          <ExitToAppIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body1">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Top Navigation Menu (Mobile) */}
      <Drawer
        anchor="right"
        open={topNavOpen}
        onClose={handleTopNavToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '70%',
            height: '100%',
            boxSizing: 'border-box',
            paddingTop: '64px',
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          height: 'calc(100% - 64px)',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src="/profile-image.jpg"
                alt="User Profile"
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">Ahmed Amaar</Typography>
                <Typography variant="body2" color="text.secondary">
                  UX UI designer
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleTopNavToggle} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List sx={{ '& .MuiListItemButton-root': { py: 2 } }}>
              <ListItemButton>
                <ListItemIcon>
                  <HomeOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Home" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <WorkOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Jobs" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <BusinessOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Employers" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <NotificationsOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Notifications" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <ChatOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Messaging" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <List sx={{ '& .MuiListItemButton-root': { py: 2 } }}>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Setting and privacy" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <TranslateOutlinedIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Language" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <HelpOutlineIcon sx={{ color: "text.secondary" }} />
                </ListItemIcon>
                <ListItemText primary="Help" primaryTypographyProps={{ fontSize: '16px' }} />
              </ListItemButton>
            </List>
          </Box>
          
          <Divider sx={{ mt: 2 }} />
          
          <List sx={{ '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main" }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '16px' }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Mobile menu drawer */}
      {mobileMenu}

      {/* Navigation sidebar */}
      <Navigation open={mobileOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
          p: 0,
          pl: 0,
          bgcolor: "#FFFFFF"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
