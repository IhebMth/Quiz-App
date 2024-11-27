import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableItem = ({ id, content, type, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              transition: 'all 0.2s ease',
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative cursor-grab active:cursor-grabbing"
            {...listeners}
            {...attributes}
        >
            {type === 'image' ? (
                <div className="flex justify-center items-center p-2">
                    <img
                        src={content}
                        alt={label}
                        className="w-32 h-auto object-cover rounded-lg"
                        style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                        }}
                    />
                </div>
            ) : (
                <div className="p-3 sm:p-4 bg-blue-500 text-white text-sm sm:text-base font-medium min-h-[2rem] flex items-center justify-center">
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
