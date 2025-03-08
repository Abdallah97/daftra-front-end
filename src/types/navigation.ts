export interface NavigationItem {
  id: number | string;
  title: string;
  target?: string;
  visible?: boolean;
  children?: NavigationItem[];
}

export interface NavigationAnalytics {
  itemId: number | string;
  fromIndex: number;
  toIndex: number;
  parentId?: string;
  timestamp: number;
}

export interface NavigationChanges {
  items: NavigationItem[];
  analytics: NavigationAnalytics[];
}

export interface DragDropPayload {
  id: number;
  from: number;
  to: number;
}

export interface NavigationContextType {
  items: NavigationItem[];
  isEditMode: boolean;
  analytics: NavigationAnalytics[];
  setEditMode: (mode: boolean) => void;
  updateItemVisibility: (itemId: string, visible: boolean) => void;
  updateItemTitle: (itemId: string, title: string) => void;
  moveItem: (fromIndex: number, toIndex: number, parentId?: string) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  reloadData: () => Promise<void>;
}

export interface NavigationItemProps {
  id: number | string;
  title: string;
  target?: string;
  visible?: boolean;
  children?: NavigationItem[];
}

export interface DragItem {
  id: number | string;
  index: number;
  parentId?: string;
}
