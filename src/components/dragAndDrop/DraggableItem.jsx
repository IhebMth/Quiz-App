import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableItem = ({ id, content, type, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type, content, label }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
    zIndex: isDragging ? 1000 : 1,
    touchAction: 'none', // Prevents default touch behaviors
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative select-none
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        transform transition-gpu
        ${isDragging ? 'scale-105 ' : 'hover:scale-102 '}
        active:scale-105
      `}
      {...listeners}
      {...attributes}
    >
      {type === 'image' ? (
        <div className="flex justify-center items-center p-1">
          <img
            src={content}
            alt={label}
            className={`
              w-16 h-auto object-cover rounded-lg
              transition-transform duration-200
              ${isDragging ? 'scale-105' : ''}
            `}
            draggable="false"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
              pointerEvents: 'none'
            }}
          />
        </div>
      ) : (
        <div className={`
            p-3 w-auto  max-w-64   bg-blue-500 text-white text-sm font-medium
          min-h-[1.5rem] mx-auto flex items-center justify-center rounded-md
          transition-colors duration-200
          ${isDragging ? 'bg-blue-600' : 'hover:bg-blue-550'}
        `}>
          {content}
        </div>
      )}
    </div>
  );
};

DraggableItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'image']).isRequired,
  label: PropTypes.string,
};

export default DraggableItem;