"use client";

import React, { useState, useEffect } from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
import {
  Drawer,
  List,
  IconButton,
  Box,
  Button,
  Divider,
  Typography,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
  CircularProgress,
  useMediaQuery,
  AppBar,
  Toolbar
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from "@mui/icons-material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import NavItem from "./NavItem";
import { useNavigation } from "../../contexts/navigation/NavigationProvider";
import { fetchNavigationItems, saveNavigationChanges, resetNavigation, trackNavChange } from "../../services/api";
import { NavigationItem, NavigationChanges, NavigationAnalytics } from "@/types/navigation";

const drawerWidth = 300;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    paddingTop: 64,
  },
  "& .MuiList-root": {
    padding: theme.spacing(0),
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: "#FFFFFF",
}));

const MenuHeader = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

const ViewModeListItem = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2),
  borderRadius: 4,
  margin: theme.spacing(0.5, 1),
  backgroundColor: "#F5F5F5",
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.5),
    margin: theme.spacing(0.5, 0.5),
  },
}));

const ViewModeChildListItem = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  paddingLeft: theme.spacing(4),
  borderRadius: 4,
  margin: theme.spacing(0.5, 1),
  backgroundColor: "#F5F5F5",
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.5),
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(0.5, 0.5),
  },
}));

const DrawerFooter = styled(Box)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: "#FFFFFF",
  zIndex: 10,
}));


const MobileDrawerHeader = styled(AppBar)(({ theme }) => ({
  position: "sticky",
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
}));

const MobileMenuItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
}));

const MobileMenuItemNested = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  paddingLeft: theme.spacing(4),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
}));

interface NavigationProps {
  open: boolean;
  onClose: () => void;
}

export default function Navigation({ open, onClose }: NavigationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { 
    items, 
    setItems, 
    originalItems, 
    setOriginalItems, 
    isEditMode, 
    setEditMode,
    moveItem 
  } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const sections: Record<string, boolean> = {};
      
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          sections[item.id.toString()] = expandedSections[item.id.toString()] || false;
        }
      });
      
      setExpandedSections(sections);
    }
  }, [items]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchNavigationItems();
      setItems(data);
      setOriginalItems(JSON.parse(JSON.stringify(data)));
      
      const expanded: Record<string, boolean> = {};
      const sections: Record<string, boolean> = {};
      
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          expanded[item.id] = false;
          sections[item.id.toString()] = false;
        }
      });
      
      setExpandedItems(expanded);
      setExpandedSections(sections);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerClose = () => {
    onClose();
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await saveNavigationChanges({
        items: items,
        analytics: []
      });
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      setEditMode(false);
      if (isMobile) {
        setShowMobileMenu(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    setEditMode(false);
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      
      setItems(JSON.parse(JSON.stringify(originalItems)));
      setEditMode(false);
    } else {
      
      setEditMode(true);
    }
  };

  const handleToggleExpand = (itemId: string | number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId.toString()]: !prev[itemId.toString()],
    }));
  };

  const handleToggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleMobileEditMode = () => {
    setShowMobileMenu(false);
    setEditMode(true);
  };
  
  const handleBackToMobileMenu = () => {
    setShowMobileMenu(true);
    setEditMode(false);
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetNavigation();
      await loadData();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleMoveItem = (fromIndex: number, toIndex: number, parentId?: string) => {
    moveItem(fromIndex, toIndex, parentId);
    
    let movedItemId: string | number | undefined;
    
    if (parentId) {
      const parentItem = items.find(item => item.id.toString() === parentId);
      if (parentItem?.children && parentItem.children.length > fromIndex) {
        movedItemId = parentItem.children[fromIndex].id;
      }
    } else {
      if (items.length > fromIndex) {
        movedItemId = items[fromIndex].id;
      }
    }
      
    if (movedItemId) {
      const analyticData: NavigationAnalytics = {
        itemId: movedItemId,
        fromIndex,
        toIndex,
        parentId,
        timestamp: Date.now()
      };
      
      trackNavChange(analyticData).catch(error => {
      });
    }
  };

 
  const renderEditModeItems = () => {
    return (
      <>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <NavItem
              item={item}
              index={index}
              onMove={(fromIndex, toIndex) => handleMoveItem(fromIndex, toIndex)}
            />

            {/* Render children if any */}
            {item.children && item.children.length > 0 && (
              <List component="div" disablePadding>
                {item.children.map((child, childIndex) => (
                  <NavItem
                    key={child.id}
                    item={child}
                    index={childIndex}
                    parentId={item.id.toString()}
                    onMove={(fromIndex, toIndex) =>
                      handleMoveItem(fromIndex, toIndex, item.id.toString())
                    }
                    isChild={true}
                  />
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const renderViewModeItems = () => {
    return (
      <>
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems[item.id] || false;

          return (
            <React.Fragment key={item.id}>
              <ViewModeListItem
                onClick={() => hasChildren && handleToggleExpand(item.id)}
                sx={{
                  opacity: !item.visible ? 0.5 : 1,
                }}
              >
                <ListItemText primary={item.title} />
                {hasChildren &&
                  (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ViewModeListItem>

              {hasChildren && isExpanded && (
                <List component="div" disablePadding>
                  {item.children?.map((child) => (
                    <ViewModeChildListItem
                      key={child.id}
                      sx={{
                        opacity: !child.visible ? 0.5 : 1,
                      }}
                    >
                      <ListItemText primary={child.title} />
                    </ViewModeChildListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const mobileMenuDrawer = (
    <>
      <MobileDrawerHeader>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Menu
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" color="inherit" onClick={handleMobileEditMode}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </MobileDrawerHeader>
      
      <List sx={{ bgcolor: '#f5f5f5', height: '100%', py: 0 }}>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <MobileMenuItem 
              onClick={() => item.children && item.children.length > 0 && handleToggleSection(item.id.toString())}
              sx={{ opacity: !item.visible ? 0.5 : 1 }}
            >
              <ListItemText primary={item.title} />
              {item.children && item.children.length > 0 && (
                expandedSections[item.id.toString()] ? 
                <KeyboardArrowUpIcon /> : 
                <KeyboardArrowDownIcon />
              )}
            </MobileMenuItem>
            
            {item.children && item.children.length > 0 && (
              <Collapse in={expandedSections[item.id.toString()]} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {item.children.map((child) => (
                    <MobileMenuItemNested key={child.id} sx={{ opacity: !child.visible ? 0.5 : 1 }}>
                      <ListItemText primary={child.title} />
                    </MobileMenuItemNested>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );


  const mobileEditDrawer = (
    <>
      <MobileDrawerHeader>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBackToMobileMenu} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Edit Menu
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleDiscardChanges}
              sx={{ color: "error.main" }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={handleSaveChanges}
              sx={{ color: "success.main" }}
            >
              <CheckIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </MobileDrawerHeader>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <List sx={{ p: 0, pb: 10 }}>
            {renderEditModeItems()}
          </List>
        </DndProvider>
      )}
    </>
  );

  // Original drawer content for desktop
  const drawer = (
    <>
      <DrawerHeader>
        <MenuHeader>Menu</MenuHeader>
        {isEditMode ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handleDiscardChanges}
              sx={{ color: "error.main" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleSaveChanges}
              sx={{ color: "success.main" }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={handleToggleEditMode}>
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}
      </DrawerHeader>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <List sx={{ p: 0 }}>
            {isEditMode ? renderEditModeItems() : renderViewModeItems()}
          </List>
        </DndProvider>
      )}

      {/* Edit Mode Footer */}
      {isEditMode && (
        <DrawerFooter>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveChanges}
            disabled={loading}
            sx={{ mr: 1 }}
            size={isMobile ? "small" : "medium"}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleDiscardChanges}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
          >
            Discard
          </Button>
        </DrawerFooter>
      )}
    </>
  );

  const mobileContent = isEditMode || !showMobileMenu ? mobileEditDrawer : mobileMenuDrawer;

  return (
    <Box component="nav">
      {/* Mobile drawer */}
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease-in-out",
            backgroundColor: "#FFFFFF",
            width: "100%", 
            top: 0,
            height: "100%",
          },
        }}
      >
        {isMobile ? mobileContent : drawer}
      </StyledDrawer>
      
      {/* Desktop drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            backgroundColor: "#FFFFFF",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
}
