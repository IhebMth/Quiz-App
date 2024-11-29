import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableItem = ({ id, content, type, label, isOriginalPosition }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'all 0.2s ease',
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative cursor-grab active:cursor-grabbing ${
                isOriginalPosition ? 'shadow-sm hover:shadow-md' : ''
            }`}
            {...listeners}
            {...attributes}
        >
            {type === 'image' ? (
                <div className="flex justify-center items-center p-1">
                    <img
                        src={content}
                        alt={label}
                        className="w-16 h-auto object-cover rounded-lg"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                    />
                </div>
            ) : (
                <div className="p-2 bg-blue-500 text-white text-xs font-medium min-h-[1.5rem] flex items-center justify-center rounded-md">
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
    isOriginalPosition: PropTypes.bool
};

export default DraggableItem;