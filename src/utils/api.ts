import axios from "axios";
import { NavigationItem, DragDropPayload } from "../types/navigation";

const API_BASE_URL = "https://daftra-backend.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchNavigationItems = async (): Promise<NavigationItem[]> => {
  try {
    const response = await api.get<NavigationItem[]>("/nav");
    return response.data;
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    throw error;
  }
};

export const saveNavigationItems = async (
  items: NavigationItem[]
): Promise<void> => {
  try {
    await api.post("/nav", items);
  } catch (error) {
    console.error("Error saving navigation items:", error);
    throw error;
  }
};

export const trackItemDragDrop = async (
  payload: DragDropPayload
): Promise<void> => {
  try {
    await api.post("/track", payload);
  } catch (error) {
    console.error("Error tracking item drag and drop:", error);
    
  }
};

export default api;
