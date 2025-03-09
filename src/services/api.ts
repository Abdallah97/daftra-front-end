import axios from "axios";
import {
  NavigationItem,
  NavigationChanges,
  NavigationAnalytics,
} from "../types/navigation";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://daftra-backend.vercel.app";



const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchNavigationItems(): Promise<NavigationItem[]> {
  try {
    const response = await api.get("/nav");
    
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      return [];
    }

    const transformedData = response.data.map((item: Record<string, unknown>) =>
      transformNavItem(item)
    );
    return transformedData;
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    throw error;
  }
}

export async function saveNavigationChanges(
  changes: NavigationChanges
): Promise<void> {
  try {
    const backendItems = changes.items.map((item) =>
      transformItemForBackend(item)
    );
    
    await api.post("/nav", backendItems);
  } catch (error) {
    console.error("Error saving navigation changes:", error);
    throw error;
  }
}

export async function resetNavigation(): Promise<void> {
  try {
    await api.post("/nav/reset");
  } catch (error) {
    console.error("Error resetting navigation:", error);
    throw error;
  }
}

export async function trackNavChange(analytic: NavigationAnalytics): Promise<void> {
  try {
    await api.post("/track", {
      id: analytic.itemId,
      from: analytic.fromIndex,
      to: analytic.toIndex,
    });
  } catch (error) {
    console.error("Error tracking navigation change:", error);
  }
}

function transformNavItem(item: Record<string, unknown>): NavigationItem {
  const navItem: NavigationItem = {
    id: String(item.id),
    title: String(item.title),
    target: item.target ? String(item.target) : "",
    visible: item.visible !== false, // Default to true if not specified
  };

  if (item.children && Array.isArray(item.children) && item.children.length > 0) {
    navItem.children = item.children.map((child: Record<string, unknown>) =>
      transformNavItem(child)
    );
  }

  return navItem;
}

function transformItemForBackend(item: NavigationItem): Record<string, unknown> {
  const backendItem: Record<string, unknown> = {
    id: typeof item.id === 'string' ? parseInt(item.id, 10) || item.id : item.id,
    title: item.title,
    target: item.target,
  };


  if (!item.visible) {
    backendItem.visible = false;
  }

  if (item.children && item.children.length > 0) {
    backendItem.children = item.children.map((child) =>
      transformItemForBackend(child)
    );
  }

  return backendItem;
}
