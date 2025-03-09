import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { XYCoord } from "dnd-core";

interface DragItem {
  index: number;
  id: number;
  type: string;
}

export const ItemTypes = {
  NAV_ITEM: "navItem",
};

export const useDragDrop = (
  id: number,
  index: number,
  moveItem: (dragIndex: number, hoverIndex: number) => void
) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NAV_ITEM,
    item: { type: ItemTypes.NAV_ITEM, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ItemTypes.NAV_ITEM,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

     
      if (dragIndex === hoverIndex) {
        return;
      }

     
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  
      const clientOffset = monitor.getClientOffset();

  
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);

      
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
    handlerId,
  };
};
