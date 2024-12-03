import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// MetallicRibbon component remains the same
const MetallicRibbon = ({ text, color, gradientFrom, gradientTo }) => (
  <div className="block absolute -top-3 right-1/4 overflow-visible">
    <div className={`relative min-w-32 w-auto h-auto p-3 ${color} flex items-center justify-center shadow-lg rotate-0`}>
      <div className={`absolute inset-10 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-50`}></div>
      <span className="relative text-white font-semibold text-xs sm:text-sm tracking-wider">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      <div className="absolute inset-y-0 right-0 w-px bg-white opacity-30"></div>
    </div>
  </div>
);

MetallicRibbon.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
};

// ReadOnlyItem component remains the same
const ReadOnlyItem = ({ content, type, label }) => (
  <div className="relative p-2 cursor-pointer">
    {type === 'image' ? (
      <div className="flex justify-center items-center p-2">
        <img
          src={content}
          alt={label || 'Image'}
          className="w-24 h-auto object-cover"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
          }}
        />
      </div>
    ) : (
      <div className="p-3 sm:p-4 bg-blue-500 text-white text-xs sm:text-sm font-medium min-h-[3rem] flex items-center justify-center rounded-lg shadow-md">
        {content}
      </div>
    )}
  </div>
);

ReadOnlyItem.propTypes = {
  content: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'image']).isRequired,
  label: PropTypes.string,
};

const CategoryZone = ({ title, items = [], className = '' }) => (
  <div className={`border-2 border-blue-300 rounded-lg text-center ${className}`}>
    <div className="border-b-2 border-blue-300 bg-transparent px-4 py-2 font-medium text-sm">
      {title}
    </div>
    <div className="p-4 min-h-[100px] grid grid-row-2 gap-4">  {/* Removed sm: breakpoint */}
      {items.map((item, index) => (
        <ReadOnlyItem key={index} content={item.content} type={item.type} label={item.label} />
      ))}
    </div>
  </div>
);

CategoryZone.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'image']).isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
};

// Main IncorrectFeedback component remains the same with updated grid classes
const IncorrectFeedback = ({ isVisible, currentExercise, userAnswers, onGotIt, sensoryExamples }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto p-4"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Sorry, incorrect...</h2>
        </div>

        {/* Correct Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 mt-4  relative">
          <MetallicRibbon text="Correct Answer" color="bg-green-600" gradientFrom="green-400" gradientTo="green-800" />
          <h3 className="font-medium text-sm sm:text-base mt-8">Correct answer:</h3>
          <div className="grid grid-cols-2 gap-4"> {/* Removed sm: breakpoint */}
            {currentExercise.categories.map((category) => (
              <CategoryZone
                key={category}
                title={category}
                items={currentExercise.options.filter((option) => option.category === category)}
              />
            ))}
          </div>
        </div>

        {/* Your Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon text="Your Answer" color="bg-red-500" gradientFrom="red-400" gradientTo="red-800" />
          <h3 className="font-medium text-sm sm:text-base mt-8">You answered:</h3>
          <div className="grid grid-cols-2 gap-4"> {/* Removed sm: breakpoint */}
            {Object.entries(userAnswers).map(([category, items]) => (
              <CategoryZone key={category} title={category} items={items} />
            ))}
          </div>
        </div>

        {/* Sensory Examples Section */}
        {sensoryExamples && (
          <div className="space-y-4 border border-gray-300 p-5 relative">
            <MetallicRibbon text="Sensory Details" color="bg-yellow-600" gradientFrom="yellow-400" gradientTo="yellow-800" />
            <p className="text-gray-700 text-xs sm:text-sm pt-3">
              When you write, you can use <strong>sensory details</strong> to make stories and scenes easier for the
              reader to imagine. A sensory detail makes the reader imagine a particular sight, sound, smell, taste, or
              touch.
            </p>
            {Object.keys(sensoryExamples).map((sensoryType) => (
              <div key={sensoryType}>
                {sensoryExamples[sensoryType].map((example, index) => (
                  <span key={index} className="block mb-2 text-xs sm:text-sm">
                    <strong>{sensoryType}:</strong> {example.key} – {example.solution}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Solve Section */}
        {currentExercise.solve && (
          <div className="space-y-4 border border-gray-300 p-5 relative">
            <MetallicRibbon text="Solve" color="bg-blue-600" gradientFrom="blue-400" gradientTo="blue-800" />
            <p className="text-gray-700 text-xs sm:text-sm pt-3">{currentExercise.solve}</p>
          </div>
        )}

        {/* Got It Button */}
        <button
          className="flex justify-center w-48 p-2 mx-auto bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
          onClick={onGotIt}
        >
          Got It
        </button>
      </div>
    </motion.div>
  );
};

IncorrectFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'image']).isRequired,
        label: PropTypes.string,
      })
    ).isRequired,
    solve: PropTypes.string,
  }).isRequired,
  userAnswers: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'image']).isRequired,
        label: PropTypes.string,
      })
    )
  ).isRequired,
  onGotIt: PropTypes.func.isRequired,
  sensoryExamples: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        solution: PropTypes.string.isRequired,
      })
    )
  ),
};

export default IncorrectFeedback;