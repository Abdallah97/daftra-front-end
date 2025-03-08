"use client";

import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  useTheme,
  styled,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Translate as TranslateIcon,
  HelpOutline as HelpOutlineIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Navigation from "@/components/navigation/Navigation";
import { usePathname } from "next/navigation";

const drawerWidth = 260;


const SearchBar = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 25,
  backgroundColor: "#FFFFFF",
  border: "1px solid #E0E0E0",
  width: "100%",
  maxWidth: 500,
  marginLeft: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    width: "auto",
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
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "24px",
  color: "white",
  display: "flex",
  alignItems: "center",
  "& span": {
    color: "#4CAF50",
  },
}));

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 40,
  margin: theme.spacing(0, 2),
  backgroundColor: "rgba(255, 255, 255, 0.2)",
}));

export default function SlugPage({ params }: { params: { slug: string[] } }) {
  const theme = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const profileOpen = Boolean(profileAnchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F5F5" }}>
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo variant="h6">
              i<span>ZAM</span>
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavButton>
              <HomeIcon />
              <Typography variant="caption">Home</Typography>
            </NavButton>

            <NavButton>
              <WorkIcon />
              <Typography variant="caption">Jobs</Typography>
            </NavButton>

            <NavButton>
              <BusinessIcon />
              <Typography variant="caption">Employers</Typography>
            </NavButton>

            <VerticalDivider orientation="vertical" flexItem />

            <NavButton>
              <Badge
                badgeContent={1}
                color="error"
                sx={{ "& .MuiBadge-badge": { top: 2, right: 2 } }}
              >
                <NotificationsIcon />
              </Badge>
              <Typography variant="caption">Notifications</Typography>
            </NavButton>

            <NavButton>
              <Badge
                badgeContent={1}
                color="error"
                sx={{ "& .MuiBadge-badge": { top: 2, right: 2 } }}
              >
                <ChatIcon />
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
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={profileOpen}
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
          <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
          <Typography variant="body1">Setting and privacy</Typography>
        </MenuItem>
        <MenuItem sx={{ py: 1.5 }}>
          <TranslateIcon fontSize="small" sx={{ mr: 2 }} />
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

      <Navigation open={mobileOpen} onClose={handleDrawerToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          
          mt: "64px",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="medium">
              {pathname}
            </Typography>
            <Typography variant="body1" paragraph>
              This is an empty page for demonstration purposes. The navigation
              functionality is fully implemented.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
