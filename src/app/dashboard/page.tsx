"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Menu,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Image from "next/image";

interface LogoProps {
  text?: string;
  image?: string;
  bgColor?: string;
  color?: string;
}

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  logo: LogoProps;
  timePosted: string;
  applicants: string;
  location?: string;
  experience?: string;
  jobTypes: string[];
  skills: string[];
  saved?: boolean;
}

// Job card component
const JobCard = ({
  title,
  company,
  logo,
  timePosted,
  location,
  experience,
  jobTypes,
  skills,
  saved = false,
}: JobCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSaved, setIsSaved] = React.useState(saved);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        mb: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        transition: "all 0.2s ease",
        backgroundColor: "#FFFFFF",
        "&:hover": {
          borderColor: "#4caf50",
          boxShadow: "0 2px 8px rgba(76, 175, 80, 0.15)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex" gap={isMobile ? 1 : 2}>
            <Box
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                bgcolor: logo.bgColor || "#e3f2fd",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {logo.text && (
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  color={logo.color || "primary"}
                >
                  {logo.text}
                </Typography>
              )}
              {logo.image && (
                <Image
                  src={logo.image}
                  alt={company}
                  width={isMobile ? 24 : 32}
                  height={isMobile ? 24 : 32}
                />
              )}
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                fontWeight={500}
                sx={{
                  color: isHovered ? "primary.main" : "text.primary",
                  transition: "color 0.2s ease",
                  fontSize: isMobile ? "1rem" : undefined,
                }}
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {company}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#f44336",
              },
            }}
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? (
              <FavoriteIcon fontSize="small" sx={{ color: "#f44336" }} />
            ) : (
              <FavoriteBorderIcon fontSize="small" sx={{ color: "#bdbdbd" }} />
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1 : 2}
            mb={1}
            alignItems={isMobile ? "flex-start" : "center"}
          >
            {location && (
              <Box display="flex" alignItems="center" gap={0.5}>
                <LocationIcon
                  fontSize="small"
                  color="action"
                  sx={{ fontSize: 18 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" gap={0.5}>
              <CalendarIcon
                fontSize="small"
                color="action"
                sx={{ fontSize: 18 }}
              />
              <Typography variant="body2" color="text.secondary">
                {timePosted}
              </Typography>
            </Box>
          </Stack>

          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {experience && (
              <Chip
                label={experience}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            )}
            {jobTypes.map((type: string, index: number) => (
              <Chip
                key={index}
                label={type}
                size="small"
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1.5} mt={2}>
            {skills.map((skill, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  '&:not(:last-child):after': {
                    content: 'none'
                  }
                }}
              >
                {skill}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Custom pagination component
const CustomPagination = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
          height: isMobile ? 28 : 32,
        }}
      >
        <Box
          component="span"
          sx={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #e0e0e0",
            color: "#9e9e9e",
            fontSize: "0.875rem",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          ‹
        </Box>

        <Box
          component="span"
          sx={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #e0e0e0",
            color: "#9e9e9e",
            fontSize: "0.875rem",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          1
        </Box>

        <Box
          component="span"
          sx={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#4caf50",
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          2
        </Box>

        <Box
          component="span"
          sx={{
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid #e0e0e0",
            color: "#9e9e9e",
            fontSize: "0.875rem",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          ›
        </Box>
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const sortOpen = Boolean(sortAnchorEl);
  const [sortOption, setSortOption] = useState("Top match");

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = (option?: string) => {
    if (option) {
      setSortOption(option);
    }
    setSortAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    if (window && window.parent) {
      window.parent.postMessage({ type: "TOGGLE_DRAWER" }, "*");
    }
  };

  const jobs: JobCardProps[] = [
    {
      id: 1,
      title: "Gaming UI designer",
      company: "Rockstar Games",
      logo: { text: "R", bgColor: "#e3f2fd", color: "#1976d2" },
      location: "ElMansoura, Egypt",
      timePosted: "10 days ago",
      applicants: "15 active",
      experience: "0 - 3y of exp",
      jobTypes: ["Full time", "Remote"],
      skills: ["Creative / Design", "IT / Software development", "Gaming"],
    },
    {
      id: 2,
      title: "Senior UX UI Designer",
      company: "Egabi",
      logo: { text: "F", bgColor: "#e8f5e9", color: "#2e7d32" },
      location: "Cairo, Egypt",
      timePosted: "month ago",
      applicants: "5 meetings",
      experience: "0 - 3y of exp",
      jobTypes: ["Full time", "Hybrid"],
      skills: ["Creative / Design", "IT / Software development"],
    },
  ];

  return (
    <Box sx={{ py: 0, bgcolor: '#FFFFFF' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          p: isMobile ? 1.5 : 2,
          pb: isMobile ? 0.5 : 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" mr={1}>
          Sorting by:
        </Typography>
        <Box
          onClick={handleSortClick}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="body2"
            color="primary"
            fontWeight={500}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {sortOption}
            <ArrowDownIcon
              fontSize="small"
              sx={{
                ml: 0.5,
                fontSize: "16px",
                color: "primary.main",
              }}
            />
          </Typography>
        </Box>
        <Menu
          anchorEl={sortAnchorEl}
          open={sortOpen}
          onClose={() => handleSortClose()}
          PaperProps={{
            elevation: 1,
            sx: {
              minWidth: 150,
              borderRadius: 1,
              mt: 1,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => handleSortClose("Top match")}
            sx={{
              color: sortOption === "Top match" ? "primary.main" : "inherit",
              fontWeight: sortOption === "Top match" ? 500 : 400,
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.08)",
              },
            }}
          >
            Top match
          </MenuItem>
          <MenuItem
            onClick={() => handleSortClose("Most recent")}
            sx={{
              color: sortOption === "Most recent" ? "primary.main" : "inherit",
              fontWeight: sortOption === "Most recent" ? 500 : 400,
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.08)",
              },
            }}
          >
            Most recent
          </MenuItem>
          <MenuItem
            onClick={() => handleSortClose("Oldest first")}
            sx={{
              color: sortOption === "Oldest first" ? "primary.main" : "inherit",
              fontWeight: sortOption === "Oldest first" ? 500 : 400,
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.08)",
              },
            }}
          >
            Oldest first
          </MenuItem>
        </Menu>
      </Box>
      

      <Box sx={{ px: isMobile ? 1.5 : 2 }}>
        {/* Green header */}
       <Box display={isMobile ? "flex" : "block"} justifyContent="space-between">
        <Box
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            p: isMobile ? 1.5 : 2,
            borderRadius: 1,
            mb: 2,
           
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
          flexGrow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
          
            <Box>
              <Typography variant={isMobile ? "body1" : "h5"} fontWeight={500}>
                UI Designer in Egypt
              </Typography>
              <Typography variant="body2">70 job positions</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mt={isMobile ? 1 : 0}>
            <Typography variant="body2" mr={1}>
              Set alert
            </Typography>
            <Switch
              defaultChecked
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "white",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            />
          </Box>
           
        </Box>
        <Box>
        {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  ml: 1, 
                  mt: 3, 
                  p: 1,
                  border: '1px solid #E0E0E0',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  }
                }}
              >
                <MenuIcon sx={{ color: '#666666', fontSize: 24 }} />
              </IconButton>
            )}
            
        </Box>
        </Box>
        
        

        {/* Job Listings */}
        <Box sx={{ mb: 3 }}>
        
          {jobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </Box>

        {/* Pagination */}
        <CustomPagination />
      </Box>
      
    </Box>
  );
}
