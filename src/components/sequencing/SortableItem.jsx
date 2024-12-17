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
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : 'all 150ms ease',
    zIndex: isDragging ? 999 : 1,
    position: 'relative',
    scale: isActive ? 1.02 : 1,
  };

  const getItemStyles = () => {
    const baseStyles = `
      cursor-grab text-white active:cursor-grabbing
      bg-blue-600 rounded-lg shadow-sm
      border border-gray-200
      hover:shadow-md transition-shadow
      ${isActive ? 'ring-2 ring-blue-800 shadow-lg' : ''}
      ${isDragging ? 'bg-blue-600 shadow-lg opacity-50' : ''}
      select-none
    `;

    switch (type) {
      case 'phrases':
        return `${baseStyles} flex-shrink-0 w-auto p-2 sm:p-3 text-sm sm:text-base`;
      case 'sentence':
        return `${baseStyles} w-full min-w-[60px] p-2 sm:p-3 text-sm sm:text-base`;
      case 'image-word':
        return `${baseStyles} w-full p-2 sm:p-3 text-sm sm:text-base min-w-[40px] text-center`;
      default:
        return `${baseStyles} w-full min-w-[80px] p-2 sm:p-3 text-sm sm:text-base`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={getItemStyles()}
      style={style}
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