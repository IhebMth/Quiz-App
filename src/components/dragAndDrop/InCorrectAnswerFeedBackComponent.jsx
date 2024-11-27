import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ReadOnlyItem = ({ content, type, label }) => (
  <div className="relative p-2 cursor-pointer">
    {type === 'image' ? (
      <div className="flex justify-center items-center p-2 ">
        <img
          src={content}
          alt={label || 'Image'}
          className="w-24 h-auto object-cover rounded-lg"
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
  <div className={`border border-gray-200 rounded-lg ${className}`}>
    <div className="border-b border-gray-300 px-4 py-2 font-medium bg-blue-50 text-sm">
      {title}
    </div>
    <div className="p-4 min-h-[100px] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <ReadOnlyItem
          key={index}
          content={item.content}
          type={item.type}
          label={item.label}
        />
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
          <h2 className="text-xl font-semibold text-base">Sorry, incorrect...</h2>
        </div>
  
        {/* Correct Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          {/* Flag design on the left side with vertical text */}
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-10 min-h-28 bg-green-600 text-white flex items-center justify-center font-medium text-xs sm:text-sm rounded-r-lg">
            <span className="transform rotate-90 whitespace-nowrap">Correct Answer</span>
          </div>
  
          <h3 className="font-medium text-sm sm:text-base">The correct answer is:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6"> {/* Added margin-left here */}
            {currentExercise.categories.map((category) => (
              <CategoryZone
                key={category}
                title={category}
                items={currentExercise.options.filter(
                  (option) => option.category === category
                )}
              />
            ))}
          </div>
        </div>
  
        {/* Your Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          {/* Flag design on the left side with vertical text */}
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-10 min-h-28 bg-red-600 text-white flex items-center justify-center font-medium text-xs sm:text-sm rounded-r-lg">
            <span className="transform rotate-90 whitespace-nowrap">Your Answer</span>
          </div>
  
          <h3 className="font-medium text-sm sm:text-base">You answered:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6"> {/* Added margin-left here */}
            {Object.entries(userAnswers).map(([category, items]) => (
              <CategoryZone key={category} title={category} items={items} />
            ))}
          </div>
        </div>
  
        {/* Sensory Examples Section */}
        {sensoryExamples && (
          <div className="space-y-4 border border-gray-300 p-5 relative">
            {/* Flag design on the left side with vertical text */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-10 min-h-28 bg-yellow-600 text-white flex items-center justify-center font-medium text-xs sm:text-sm rounded-r-lg">
              <span className="transform rotate-90 whitespace-nowrap">Sensory Details</span>
            </div>
  
            <p className="text-gray-700 mb-6 ml-6 text-xs sm:text-sm">
              When you write, you can use <strong>sensory details</strong> to
              make stories and scenes easier for the reader to imagine. A
              sensory detail makes the reader imagine a particular sight, sound,
              smell, taste, or touch.
            </p>
            {Object.keys(sensoryExamples).map((sensoryType) => (
              <div key={sensoryType}>
                <p className="text-sm sm:text-base text-gray-700 ml-6">
                  {sensoryExamples[sensoryType].map((example, index) => (
                    <span key={index} className="block mb-2 text-xs sm:text-sm">
                      <strong>{sensoryType}:</strong> {example.key} – {example.solution}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        )}
  
        {/* Solve Section */}
        {currentExercise.solve && (
          <div className="space-y-4 border border-gray-300 p-5 relative">
            {/* Flag design on the left side with vertical text */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-10 min-h-28  bg-blue-600 text-white flex items-center justify-center font-medium text-xs sm:text-sm rounded-r-lg">
              <span className="transform rotate-90 whitespace-nowrap">Solve</span> {/* Vertically rotated text */}
            </div>
  
            {/* Content section */}
            <p className="text-gray-700 ml-6 text-xs sm:text-sm">{currentExercise.solve}</p> {/* Added left margin to avoid overlap */}
          </div>
        )}
  
        {/* Got It Button */}
        <button
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
          onClick={onGotIt} // Call the onGotIt prop when clicked
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
    solve: PropTypes.string, // Add the solve field
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
  ).isRequired,
};

export default IncorrectFeedback;
