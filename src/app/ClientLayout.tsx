"use client";

import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import { NavigationProvider } from "@/contexts/navigation/NavigationProvider";
import { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider>
      <NavigationProvider>{children}</NavigationProvider>
    </ThemeProvider>
  );
}
