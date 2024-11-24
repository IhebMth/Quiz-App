import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import DraggableItem from './DraggableItem';

const DroppableZone = ({ id, label, items = [] }) => {
    const { isOver, setNodeRef } = useDroppable({ id });
    
    return (
        <div
            ref={setNodeRef}
            className={`border-2 rounded-lg transition-colors duration-200 ${
                isOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-300 bg-white'
            }`}
        >
            <div className={`text-gray-700 font-medium text-center py-2 sm:py-3 border-b-2 ${
                isOver ? 'border-blue-500' : 'border-blue-300'
            }`}>
                <span className="capitalize text-sm sm:text-base">{label}</span>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">
                    ({items.length})
                </span>
            </div>
           
            <div className="min-h-[120px] sm:min-h-[200px] p-2 sm:p-4 space-y-2 sm:space-y-3">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DraggableItem id={item.id} text={item.content} />
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
            category: PropTypes.string.isRequired
        })
    ),
};

export default DroppableZone;