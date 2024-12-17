import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const MetallicRibbon = ({ text, color, gradientFrom, gradientTo }) => (
  <div className="block absolute -top-3 right-1/4">
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

const SequenceDisplay = ({ items, type }) => {
  const getDisplayStyle = () => {
    if (type === 'phrases') {
      return 'flex flex-col gap-2';
    }
    if (type === 'image-word') {
      return 'flex gap-2 justify-center';
    }
    return 'flex flex-wrap gap-2';
  };

  const getItemStyle = () => {
    if (type === 'phrases') {
      return 'bg-gray-100 p-2 rounded-lg text-sm';
    }
    if (type === 'image-word') {
      return 'bg-gray-100 px-4 py-2 rounded-lg text-lg font-semibold';
    }
    return 'bg-gray-100 px-3 py-1 rounded text-sm';
  };

  return (
    <div className={getDisplayStyle()}>
      {items.map((item, index) => (
        <div key={index} className={getItemStyle()}>
          {item}
        </div>
      ))}
    </div>
  );
};

SequenceDisplay.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
};

const IncorrectSequencingFeedback = ({
  isVisible,
  currentExercise,
  userAnswer,
  onGotIt
}) => {
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
          <h2 className="text-xl font-semibold">Sorry, incorrect sequence...</h2>
        </div>

        {/* Your Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Your Sequence" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8">
            <SequenceDisplay 
              items={userAnswer} 
              type={currentExercise.type}
            />
          </div>
        </div>

        {/* Correct Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Correct Sequence" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8">
            <SequenceDisplay 
              items={currentExercise.correctOrder} 
              type={currentExercise.type}
            />
          </div>
        </div>

        {/* Explanation Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Explanation" 
            color="bg-blue-600" 
            gradientFrom="blue-400" 
            gradientTo="blue-800" 
          />
          <div className="mt-8 space-y-4">
            <p className="text-gray-700 text-sm">
              {currentExercise.solution}
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Tips" 
            color="bg-yellow-600" 
            gradientFrom="yellow-400" 
            gradientTo="yellow-800" 
          />
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Sequencing Strategies</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Look for beginning markers (Once, First, The)</li>
                  <li>Identify logical connections between items</li>
                  <li>Check if the sequence makes sense when read aloud</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Common Patterns</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Time order (first, then, finally)</li>
                  <li>Cause and effect relationships</li>
                  <li>Size or quantity progression</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Got It Button */}
        <button
          onClick={onGotIt}
          className="flex justify-center w-48 p-2 mx-auto bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          Got It
        </button>
      </div>
    </motion.div>
  );
};

IncorrectSequencingFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    type: PropTypes.string.isRequired,
    correctOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
    solution: PropTypes.string.isRequired
  }).isRequired,
  userAnswer: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGotIt: PropTypes.func.isRequired,
};

export default IncorrectSequencingFeedback;