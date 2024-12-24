// SortableItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

const SortableItem = ({ id, content, type = 'default', isActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id,
    transition: {
      duration: 100, // Reduced for faster response
      easing: 'ease-out',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 100ms ease-out',
    zIndex: isDragging ? 999 : 1,
    position: 'relative',
    scale: isActive ? 1.02 : 1,
    touchAction: 'none',
    willChange: 'transform',
  };

  const getItemStyles = () => {
    const baseStyles = `
      cursor-grab touch-none
      text-white
      active:cursor-grabbing
      bg-blue-600
      rounded-lg
      shadow-sm
      border border-gray-200
      hover:shadow-md
      transition-transform
      ${isActive ? 'ring-2 ring-blue-800 shadow-lg' : ''}
      ${isDragging ? 'bg-blue-700 shadow-lg opacity-90' : ''}
      select-none
      touch-manipulation
    `;

    switch (type) {
      case 'phrases':
        return `${baseStyles} flex-shrink-0 w-auto p-2 text-xs sm:text-base`;
      case 'sentence':
        return `${baseStyles} w-[1è%] min-w-[45px] max-w-[100px] p-1.5 text-center text-xs sm:text-base`;
      case 'image-word':
        return `${baseStyles} w-full p-2 text-xs sm:text-base min-w-[35px] text-center`;
      default:
        return `${baseStyles} w-full min-w-[70px] p-2 text-xs sm:text-base`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={getItemStyles()}
      style={style}
      role="button"
      tabIndex={0}
      aria-label={`Draggable item ${content}`}
    >
      {content}
    </div>
  );
};

SortableItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['sentence', 'phrases', 'image-word', 'default']),
  isActive: PropTypes.bool,
};

export default SortableItem;