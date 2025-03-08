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

    const transformedData = response.data.map((item: any) =>
      transformNavItem(item)
    );
    return transformedData;
  } catch (error) {
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
    throw error;
  }
}

export async function resetNavigation(): Promise<void> {
  try {
    await api.post("/nav/reset");
  } catch (error) {
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
  }
}

function transformNavItem(item: any): NavigationItem {
  const navItem: NavigationItem = {
    id: item.id.toString(),
    title: item.title,
    target: item.target || "",
    visible: item.visible !== false, // Default to true if not specified
  };

  if (item.children && item.children.length > 0) {
    navItem.children = item.children.map((child: any) =>
      transformNavItem(child)
    );
  }

  return navItem;
}

function transformItemForBackend(item: NavigationItem): any {
  const backendItem: any = {
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
