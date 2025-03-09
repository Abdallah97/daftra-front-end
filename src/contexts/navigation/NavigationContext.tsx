"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  NavigationItem,
  NavigationAnalytics,
} from "../../types/navigation";
import {
  fetchNavigationItems,
  saveNavigationItems,
} from "../../utils/api";

interface NavigationContextType {
  items: NavigationItem[];
  isEditMode: boolean;
  analytics: NavigationAnalytics[];
  setEditMode: (mode: boolean) => void;
  updateItemVisibility: (itemId: string, visible: boolean) => void;
  updateItemTitle: (itemId: string, title: string) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [originalItems, setOriginalItems] = useState<NavigationItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [analytics, setAnalytics] = useState<NavigationAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNavigationItems();
        setItems(data);
        setOriginalItems(JSON.parse(JSON.stringify(data))); 
      } catch (error) {
        console.error("Failed to load navigation items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const findItemById = useCallback(
    (items: NavigationItem[], itemId: string): NavigationItem | null => {
      for (const item of items) {
        if (item.id === itemId) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const found = findItemById(item.children, itemId);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const updateItemVisibility = useCallback(
    (itemId: string, visible: boolean) => {
      setItems((prevItems) => {
        const newItems = JSON.parse(JSON.stringify(prevItems)); 

        const updateVisibility = (items: NavigationItem[]): boolean => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemId) {
              items[i].visible = visible;
              return true;
            }
            if (items[i].children && items[i].children.length > 0) {
              if (updateVisibility(items[i].children)) {
                return true;
              }
            }
          }
          return false;
        };

        updateVisibility(newItems);
        return newItems;
      });
    },
    []
  );

  const updateItemTitle = useCallback((itemId: string, title: string) => {
    setItems((prevItems) => {
      const newItems = JSON.parse(JSON.stringify(prevItems));

      const updateTitle = (items: NavigationItem[]): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === itemId) {
            items[i].title = title;
            return true;
          }
          if (items[i].children && items[i].children.length > 0) {
            if (updateTitle(items[i].children)) {
              return true;
            }
          }
        }
        return false;
      };

      updateTitle(newItems);
      return newItems;
    });
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      setAnalytics((prev) => [
        ...prev,
        {
          itemId: removed.id,
          fromIndex,
          toIndex,
          timestamp: Date.now(),
        },
      ]);

      return newItems;
    });
  }, []);

  const saveChanges = useCallback(async () => {
    try {
      await saveNavigationItems({
        items,
        analytics,
      });

      setOriginalItems(JSON.parse(JSON.stringify(items))); 
      setAnalytics([]);
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save navigation changes:", error);
      throw error;
    }
  }, [items, analytics]);

  const discardChanges = useCallback(() => {
    setItems(JSON.parse(JSON.stringify(originalItems)));
    setAnalytics([]);
    setIsEditMode(false);
  }, [originalItems]);

  const value = {
    items,
    isEditMode,
    analytics,
    setEditMode,
    updateItemVisibility,
    updateItemTitle,
    moveItem,
    saveChanges,
    discardChanges,
  };

  if (isLoading) {
    return <div>Loading navigation...</div>;
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
