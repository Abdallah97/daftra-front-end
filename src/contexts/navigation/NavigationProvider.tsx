import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  NavigationItem,
  NavigationAnalytics,
} from "../../types/navigation";
import {
  fetchNavigationItems,
  saveNavigationChanges,
} from "../../services/api";

interface NavigationContextType {
  items: NavigationItem[];
  setItems: React.Dispatch<React.SetStateAction<NavigationItem[]>>;
  originalItems: NavigationItem[];
  setOriginalItems: React.Dispatch<React.SetStateAction<NavigationItem[]>>;
  isEditMode: boolean;
  analytics: NavigationAnalytics[];
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  updateItemVisibility: (itemId: string, visible: boolean) => void;
  updateItemTitle: (itemId: string, title: string) => void;
  moveItem: (fromIndex: number, toIndex: number, parentId?: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  reloadData: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [originalItems, setOriginalItems] = useState<NavigationItem[]>([]);
  const [isEditMode, setEditMode] = useState(false);
  const [analytics, setAnalytics] = useState<NavigationAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchNavigationItems();
      console.log("Fetched navigation data:", data);
      setItems(data);
      setOriginalItems(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error("Failed to load navigation items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  
  const reloadData = useCallback(async () => {
    await loadItems();
  }, [loadItems]);

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


  const findParentById = useCallback(
    (
      items: NavigationItem[],
      itemId: string,
    ): NavigationItem | null => {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          for (const child of item.children) {
            if (child.id === itemId) {
              return item;
            }
          }
          const found = findParentById(item.children, itemId);
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
            
            const children = items[i].children || [];
            if (children.length > 0) {
              if (updateVisibility(children)) {
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
       
          const children = items[i].children || [];
          if (children.length > 0) {
            if (updateTitle(children)) {
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


  const moveItem = useCallback(
    (fromIndex: number, toIndex: number, parentId?: string) => {
      setItems((prevItems) => {
        const newItems = JSON.parse(JSON.stringify(prevItems));
        
        if (parentId) {
      
          const parentItem = newItems.find((item: NavigationItem) => item.id.toString() === parentId);
          if (parentItem && parentItem.children) {
            const [movedItem] = parentItem.children.splice(fromIndex, 1);
            parentItem.children.splice(toIndex, 0, movedItem);
          }
        } else {
          
          const [movedItem] = newItems.splice(fromIndex, 1);
          newItems.splice(toIndex, 0, movedItem);
        }
        
        return newItems;
      });
    },
    []
  );


  const saveChanges = useCallback(async () => {
    try {
      await saveNavigationChanges({
        items,
        analytics,
      });

      setOriginalItems(JSON.parse(JSON.stringify(items))); 
      setAnalytics([]);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save navigation changes:", error);
      throw error;
    }
  }, [items, analytics]);


  const discardChanges = useCallback(() => {
    setItems(JSON.parse(JSON.stringify(originalItems))); 
    setAnalytics([]);
    setEditMode(false);
  }, [originalItems]);

  const value: NavigationContextType = {
    items,
    setItems,
    originalItems,
    setOriginalItems,
    isEditMode,
    analytics,
    setEditMode,
    updateItemVisibility,
    updateItemTitle,
    moveItem,
    saveChanges,
    discardChanges,
    reloadData,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
