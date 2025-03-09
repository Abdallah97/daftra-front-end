"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: "#4CAF50", 
          light: "#81C784",
          dark: "#388E3C",
        },
        secondary: {
          main: "#FF4081",
          light: "#FF80AB",
          dark: "#C51162",
        },
        background: {
          default: mode === "light" ? "#F5F5F5" : "#121212",
          paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
        },
        text: {
          primary: mode === "light" ? "#212121" : "#FFFFFF",
          secondary: mode === "light" ? "#757575" : "#B0B0B0",
        },
        divider:
          mode === "light"
            ? "rgba(0, 0, 0, 0.12)"
            : "rgba(255, 255, 255, 0.12)",
      },
      typography: {
        fontFamily:
          '"Corporative Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 500,
          fontSize: "1.5rem",
        },
        h6: {
          fontWeight: 500,
          fontSize: "1.25rem",
        },
        subtitle1: {
          fontWeight: 500,
          fontSize: "1rem",
        },
        body1: {
          fontSize: "0.875rem",
        },
        body2: {
          fontSize: "0.75rem",
        },
        caption: {
          fontSize: "0.75rem",
          fontWeight: 400,
        },
        button: {
          fontWeight: 500,
          textTransform: "none",
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: "none",
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              boxShadow:
                mode === "light"
                  ? "0px 2px 4px rgba(0, 0, 0, 0.05)"
                  : "0px 2px 4px rgba(0, 0, 0, 0.2)",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 8,
              fontWeight: 500,
              fontFamily:
                '"Corporative Sans", "Roboto", "Helvetica", "Arial", sans-serif',
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              padding: 8,
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              fontFamily:
                '"Corporative Sans", "Roboto", "Helvetica", "Arial", sans-serif',
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              fontFamily:
                '"Corporative Sans", "Roboto", "Helvetica", "Arial", sans-serif',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              fontFamily:
                '"Corporative Sans", "Roboto", "Helvetica", "Arial", sans-serif',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow:
                mode === "light"
                  ? "0px 2px 4px rgba(0, 0, 0, 0.05)"
                  : "0px 2px 4px rgba(0, 0, 0, 0.2)",
            },
          },
        },
      },
    });
  }, [mode]);

  const contextValue = useMemo(() => {
    return { mode, toggleColorMode };
  }, [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
