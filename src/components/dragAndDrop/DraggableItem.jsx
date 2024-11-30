import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

const DraggableItem = ({ id, content, type, label, isOriginalPosition }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { attributes, listeners, setNodeRef, transform, isDragging: dndIsDragging } = useDraggable({ 
        id,
        data: {
            isSelected
        }
    });

    // Update isDragging when dnd-kit's isDragging changes
    useEffect(() => {
        setIsDragging(dndIsDragging);
    }, [dndIsDragging]);

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        zIndex: (isSelected || isDragging) ? 1000 : 1
    } : undefined;

    const handleClick = () => {
        // Only toggle selection if we're not currently dragging
        if (!isDragging) {
            setIsSelected(!isSelected);
        }
    };

    // Combine selected and dragging states for styling
    const isActive = isSelected || isDragging;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative 
                ${isActive ? 'cursor-grabbing' : 'cursor-grab'} 
                ${isOriginalPosition ? 'shadow-sm hover:shadow-md' : ''}
                transform transition-all duration-300
                ${isActive ? 'scale-105 ' : ''}
            `}
            onClick={handleClick}
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
                            transition-transform duration-300
                            ${isActive ? 'scale-105' : ''}
                        `}
                        style={{ 
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                            pointerEvents: 'none'
                        }}
                    />
                </div>
            ) : (
                <div className={`
                    p-2 bg-blue-500 text-white text-xs font-medium 
                    min-h-[1.5rem] flex items-center justify-center rounded-md
                    transition-all duration-300 ease-in-out
                    ${isActive ? 'bg-blue-600 shadow-lg' : ''}
                    hover:bg-blue-550
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
    isOriginalPosition: PropTypes.bool
};

export default DraggableItem;