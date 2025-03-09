import React, { useState, useRef, useEffect } from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  IconButton,
  TextField,
  Box,
  ListItemText,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";
import {
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDrag, useDrop } from "react-dnd";
import { useNavigation } from "../../contexts/navigation/NavigationProvider";
import type { NavigationItem, DragItem } from "../../types/navigation";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2),
  gap: theme.spacing(1),
  borderRadius: 4,
  margin: theme.spacing(0.5, 1),
  cursor: "grab",
  transition: "all 0.2s ease",
  backgroundColor: "#F5F5F5",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&.dragging": {
    opacity: 0.5,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5, 1.5),
    margin: theme.spacing(0.5, 0.5),
  },
}));

const ChildListItemButton = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  gap: theme.spacing(1),
  borderRadius: 0,
  margin: theme.spacing(0, 0, 0, 4),
  cursor: "grab",
  transition: "all 0.2s ease",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&.dragging": {
    opacity: 0.5,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 1.5),
    margin: theme.spacing(0, 0, 0, 3),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    fontSize: "0.875rem",
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiInputBase-root": {
      fontSize: "0.75rem",
    },
  },
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  marginLeft: "auto",
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(0.25),
  },
}));

const DragHandle = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function NavItem({
  item,
  index,
  parentId,
  onMove,
  isChild = false,
}: {
  item: NavigationItem;
  index: number;
  parentId?: string;
  onMove: (fromIndex: number, toIndex: number) => void;
  isChild?: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { items: navItems, setItems, isEditMode } = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedTitle(item.title);
  }, [item.title]);

  const [{ isDragging }, drag] = useDrag({
    type: isChild ? "child-item" : "navigation-item",
    item: { id: item.id, index, parentId } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isEditMode,
  });

  const [, drop] = useDrop({
    accept: isChild ? "child-item" : "navigation-item",
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) return;

      if (parentId !== draggedItem.parentId) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(item.title);
  };

  const handleEditSave = () => {
    handleTitleChange(editedTitle);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditedTitle(item.title);
    setIsEditing(false);
  };

  const handleVisibilityToggle = () => {
    setItems(prevItems => {
      const newItems = JSON.parse(JSON.stringify(prevItems));
      
      const updateVisibility = (items: NavigationItem[], itemId: number | string): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === itemId) {
            items[i].visible = items[i].visible === false ? true : false;
            return true;
          }
          
          const children = items[i].children;
          if (children && children.length > 0) {
            if (updateVisibility(children, itemId)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      updateVisibility(newItems, item.id);
      return newItems;
    });
  };

  const handleTitleChange = (newTitle: string) => {
    setItems(prevItems => {
      const newItems = JSON.parse(JSON.stringify(prevItems));
      
      const updateTitle = (items: NavigationItem[], itemId: number | string, title: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === itemId) {
            items[i].title = title;
            return true;
          }
          const children = items[i].children;
          if (children && children.length > 0) {
            if (updateTitle(children, itemId, title)) {
              return true;
            }
          }
        }
        
        return false;
      };
      
      updateTitle(newItems, item.id, newTitle);
      return newItems;
    });
  };

  drag(drop(ref));

  const ItemComponent = isChild ? ChildListItemButton : StyledListItemButton;

  return (
    <ItemComponent
      ref={ref}
      className={isDragging ? "dragging" : ""}
      sx={{
        opacity: !item.visible ? 0.5 : 1,
        backgroundColor: isDragging ? alpha("#4CAF50", 0.08) : "transparent",
        pl: isChild ? (isMobile ? 3 : 4) : isMobile ? 1.5 : 2,
        pr: isMobile ? 1.5 : 2,
        py: isMobile ? 1 : 1.5,
      }}
    >
      <DragHandle>
        <DragIcon
          fontSize={isMobile ? "small" : "medium"}
          sx={{ cursor: "grab" }}
        />
      </DragHandle>

      {isEditing ? (
        <StyledTextField
          fullWidth
          size="small"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          autoFocus
          InputProps={{
            endAdornment: (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={handleEditSave}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={handleEditCancel}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ),
          }}
        />
      ) : (
        <ListItemText
          primary={item.title}
          sx={{
            "& .MuiTypography-root": {
              fontWeight: 400,
              fontSize: isMobile ? "0.8rem" : "0.875rem",
              color: !item.visible ? "text.disabled" : "text.primary",
            },
          }}
        />
      )}

      {!isEditing && (
        <ActionButtons>
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={handleEditClick}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size={isMobile ? "small" : "medium"}
            onClick={handleVisibilityToggle}
          >
            {item.visible ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <VisibilityOffIcon fontSize="small" />
            )}
          </IconButton>
        </ActionButtons>
      )}
    </ItemComponent>
  );
}
