import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableItem = ({ id, text }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'background-color 0.2s ease'
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="p-2 sm:p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md cursor-grab text-center text-sm sm:text-base font-medium shadow-md transition-colors"
            {...listeners}
            {...attributes}
        >
            {text}
        </div>
    );
};

DraggableItem.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default DraggableItem;