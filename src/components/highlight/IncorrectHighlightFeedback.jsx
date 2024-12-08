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

const HighlightDisplay = ({ text, targets, userSelections, type }) => {
  const getTargetWords = () => {
    if (type === 'pronouns') {
      return targets.map(target => target.word);
    }
    return targets;
  };

  if (type === 'vowels') {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className={`px-0.5 py-1 rounded inline-block ${
          targets.includes(char) ? 'text-green-500' :
          userSelections.has(`${char}-${index}`) ? 'text-red-500' : ''
        }`}
      >
        {char}
      </span>
    ));
  }

  return text.split(' ').map((word, index) => {
    const cleanWord = word.replace(/[.,!?]/g, '');
    const key = type === 'redundant-phrase' ? `${cleanWord}-${index}` : cleanWord;
    const targetWords = getTargetWords();
   
    if (type === 'pronouns') {
      const targetObj = targets.find(t => t.word === cleanWord);
      return (
        <span key={index}>
          <span className={`px-0.5 py-1 relative ${
            targetObj ? 'border-b-2 border-green-500' :
            userSelections.has(key) ? 'border-b-2 border-red-500' : ''
          }`}>
            {word}
            {targetObj && (
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sm text-green-500">
                {targetObj.correction}
              </span>
            )}
          </span>
          {index < text.split(' ').length - 1 ? ' ' : ''}
        </span>
      );
    }

    return (
      <span key={index}>
        <span className={`px-0.5 py-1 ${
          targetWords.includes(cleanWord) ? 'border-b-2 border-green-500' :
          userSelections.has(key) ? 'border-b-2 border-red-500' : ''
        }`}>
          {word}
        </span>
        {index < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    );
  });
};

const IncorrectHighlightFeedback = ({
  isVisible,
  currentExercise,
  selectedItems,
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
          <h2 className="text-xl font-semibold">Sorry, incorrect...</h2>
        </div>

        {/* Your Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Your Answer" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8">
            <div className="text-lg">
              <HighlightDisplay
                text={currentExercise.text}
                targets={[]}
                userSelections={selectedItems}
                type={currentExercise.type}
              />
            </div>
          </div>
        </div>

        {/* Correct Answer Section */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Correct Answer" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8">
            <div className="text-lg">
              <HighlightDisplay
                text={currentExercise.text}
                targets={currentExercise.targets}
                userSelections={new Set()}
                type={currentExercise.type}
              />
            </div>
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
              {currentExercise.explanation}
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
            <h3 className="font-medium text-sm">Common Mistakes to Avoid:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Word Selection Tips</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {currentExercise.type === 'pronouns' && (
                    <>
                      <li>Check pronoun agreement with subject</li>
                      <li>Maintain consistent point of view</li>
                      <li>Consider singular vs plural</li>
                      <li>Watch for shifts in perspective</li>
                    </>
                  )}
                  {currentExercise.type === 'redundant-phrase' && (
                    <>
                      <li>Look for repeated meanings</li>
                      <li>Identify unnecessary modifiers</li>
                      <li>Check for overlapping expressions</li>
                      <li>Remove duplicate information</li>
                    </>
                  )}
                  {currentExercise.type === 'vowels' && (
                    <>
                      <li>Remember: a, e, i, o, u are vowels</li>
                      <li>Count each vowel occurrence</li>
                      <li>Don&apos;t miss repeated vowels</li>
                      <li>Check for vowel combinations</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Practice Strategies</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Read the sentence carefully</li>
                  <li>Consider context clues</li>
                  <li>Review grammar rules</li>
                  <li>Double-check your selections</li>
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

MetallicRibbon.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
};

HighlightDisplay.propTypes = {
  text: PropTypes.string.isRequired,
  targets: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.shape({
      word: PropTypes.string.isRequired,
      correction: PropTypes.string.isRequired
    }))
  ]).isRequired,
  userSelections: PropTypes.instanceOf(Set).isRequired,
  type: PropTypes.oneOf([
    'vowels', 'words', 'redundant-phrase', 'redundant', 'nouns', 'pronouns'
  ]).isRequired,
};

IncorrectHighlightFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    text: PropTypes.string.isRequired,
    targets: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.shape({
        word: PropTypes.string.isRequired,
        correction: PropTypes.string.isRequired
      }))
    ]).isRequired,
    type: PropTypes.oneOf([
      'vowels', 'words', 'redundant-phrase', 'redundant', 'nouns', 'pronouns'
    ]).isRequired,
    explanation: PropTypes.string.isRequired,
  }).isRequired,
  selectedItems: PropTypes.instanceOf(Set).isRequired,
  onGotIt: PropTypes.func.isRequired,
};

export default IncorrectHighlightFeedback;