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
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 150ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  const getItemClasses = () => {
    const baseClasses = `
      cursor-grab
      touch-none
      select-none
      text-white
      active:cursor-grabbing
      bg-blue-600
      rounded-lg
      shadow-sm
      border
      border-gray-200
      hover:shadow-md
      transition-transform
      ${isActive ? 'ring-2 ring-blue-800 shadow-lg scale-105' : ''}
      ${isDragging ? 'bg-blue-700 shadow-lg opacity-95 z-50' : 'z-10'}
    `.trim();

    switch (type) {
      case 'phrases':
        return `${baseClasses} w-auto p-3 text-sm sm:text-base mb-2`;
      case 'sentence':
        return `${baseClasses} min-w-[60px] max-w-[120px] p-2 text-center text-sm sm:text-base`;
      case 'image-word':
        return `${baseClasses} w-full p-2 text-sm sm:text-base min-w-[40px] text-center`;
      default:
        return `${baseClasses} w-full min-w-[80px] p-2 text-sm sm:text-base`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={getItemClasses()}
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