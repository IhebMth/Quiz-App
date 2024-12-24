import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const MetallicRibbon = ({ text, color, gradientFrom, gradientTo }) => (
  <div className="block absolute -top-3 right-1/4">
    <div className={`relative min-w-24 w-auto h-auto p-2 ${color} flex items-center justify-center shadow-lg rotate-0`}>
      <div className={`absolute inset-10 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-50`}></div>
      <span className="relative text-white font-semibold text-[10px] sm:text-sm tracking-wider">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      <div className="absolute inset-y-0 right-0 w-px bg-white opacity-30"></div>
    </div>
  </div>
);

const SequenceDisplay = ({ items, type }) => {
  const getDisplayStyle = () => {
    if (type === 'phrases') {
      return 'flex flex-col gap-1.5';
    }
    if (type === 'image-word') {
      return 'flex gap-1.5 justify-center';
    }
    if (type === 'sentence') {
      return 'flex flex-wrap gap-1.5 justify-center';
    }
    return 'flex flex-wrap gap-1.5';
  };

  const getItemStyle = () => {
    const baseStyle = 'bg-gray-100 rounded-lg text-xs sm:text-sm';
    if (type === 'phrases') {
      return `${baseStyle} p-1.5 break-words max-w-full`;
    }
    if (type === 'image-word') {
      return `${baseStyle} px-3 py-1.5 font-semibold`;
    }
    if (type === 'sentence') {
      return `${baseStyle} px-2 py-1 whitespace-nowrap`;
    }
    return `${baseStyle} px-2 py-1`;
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
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-semibold">Incorrect sequence</h2>
          </div>

          <div className="border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Your Sequence" 
              color="bg-red-500" 
              gradientFrom="red-400" 
              gradientTo="red-800" 
            />
            <div className="mt-6">
              <SequenceDisplay items={userAnswer} type={currentExercise.type} />
            </div>
          </div>

          <div className="border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Correct Sequence" 
              color="bg-green-600" 
              gradientFrom="green-400" 
              gradientTo="green-800" 
            />
            <div className="mt-6">
              <SequenceDisplay items={currentExercise.correctOrder} type={currentExercise.type} />
            </div>
          </div>

          <div className="border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Explanation" 
              color="bg-blue-600" 
              gradientFrom="blue-400" 
              gradientTo="blue-800" 
            />
            <div className="mt-6">
              <p className="text-gray-700 text-xs sm:text-sm">{currentExercise.solution}</p>
            </div>
          </div>

          <div className="border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Tips" 
              color="bg-yellow-600" 
              gradientFrom="yellow-400" 
              gradientTo="yellow-800" 
            />
            <div className="mt-6">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium text-xs sm:text-sm mb-2">Sequencing Tips</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 list-disc pl-4">
                  <li>Look for beginning markers (Once, First, The)</li>
                  <li>Identify logical connections between items</li>
                  <li>Check if the sequence makes sense when read aloud</li>
                  <li>Time order (first, then, finally)</li>
                  <li>Cause and effect relationships</li>
                  <li>Size or quantity progression</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-8">
            <button
              onClick={onGotIt}
              className="w-24 sm:w-48 p-1 sm:p-2 mx-auto bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex justify-center items-center"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

MetallicRibbon.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
};

SequenceDisplay.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
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