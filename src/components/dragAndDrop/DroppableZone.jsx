import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import DraggableItem from './DraggableItem';

const DroppableZone = ({ id, label, items = [] }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    
    // Calculate height per item based on total items
    const getItemHeight = () => {
        const totalItems = Math.max(items.length, 4); // Minimum 4 slots
        const containerHeight = 410; // Fixed container height
        const padding = 32; // Account for padding
        const gap = (totalItems - 1) * 8; // Gap between items
        return (containerHeight - padding - gap) / totalItems;
    };

    return (
        <div
            ref={setNodeRef}
            className={`border-2 rounded-lg transition-colors duration-200 flex-1 w-[100px] sm:min-w-[150px] ${
                isOver ? 'border-blue-500 bg-blue-50' : 'border-blue-300 bg-transparent'
            }`}
            style={{ height: '400px' }}
        >
            <div
                className={`text-gray-700 font-medium text-center py-2 border-b-2 ${
                    isOver ? 'border-blue-500' : 'border-blue-300'
                }`}
            >
                <span className="capitalize text-xs sm:text-base">{label}</span>
                <span className="ml-1 text-xs text-gray-500">({items.length})</span>
            </div>
            <div className="text-center p-4 grid grid-cols-1 gap-2 h-[calc(400px-2.5rem)]">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                            style={{ height: `${getItemHeight()}px` }}
                        >
                            <DraggableItem
                                id={item.id}
                                content={item.content}
                                type={item.type}
                                label={item.label}
                                isOriginalPosition={false}
                                className="w-full h-full"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

DroppableZone.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            type: PropTypes.oneOf(['text', 'image']).isRequired,
            label: PropTypes.string,
            category: PropTypes.string.isRequired,
        })
    ),
};

export default DroppableZone;