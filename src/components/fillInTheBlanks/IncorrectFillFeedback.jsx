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

const AnswerDisplay = ({ label, answer, isCorrect }) => (
  <div className="p-3 sm:p-4 bg-white border rounded-lg shadow-sm">
    <span className="block text-sm text-gray-600 mb-2">{label}:</span>
    <span className={`text-lg font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
      {answer}
    </span>
  </div>
);

AnswerDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  answer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCorrect: PropTypes.bool.isRequired,
};

const IncorrectFillFeedback = ({
  isVisible,
  currentExercise,
  userAnswer,
  onGotIt
}) => {
  if (!isVisible) return null;

  const renderSentence = (answer) => {
    // Handle simple addition type
    if (currentExercise.type === 'simple_addition') {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentExercise.given}</span>
            <span className="text-2xl">+</span>
            <span className="text-2xl">{currentExercise.suffix}</span>
            <span className="text-2xl">=</span>
            <span className="text-2xl bg-gray-200 px-3 py-1 rounded">{answer}</span>
          </div>
        </div>
      );
    }

    // Handle possessive hint type
    if (currentExercise.type === 'possessive_hint') {
      const parts = currentExercise.sentence.split("{answer}");
      const [before, after] = parts;
      const given = currentExercise.given;

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="bg-green-100 p-2 rounded-lg inline-block">
              <span className="font-medium">{currentExercise.hintWord}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span dangerouslySetInnerHTML={{ __html: before.replace("{given}", `<strong>${given}</strong>`) }} />
              <span className="bg-gray-200 px-2 py-1 rounded">{answer}</span>
              <span>{after}</span>
            </div>
          </div>
        </div>
      );
    }

    // Handle default word completion type
    const parts = currentExercise.sentence.split("{answer}");
    const [before, after] = parts;
    const given = currentExercise.given;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span dangerouslySetInnerHTML={{ __html: before.replace("{given}", `<strong>${given}</strong>`) }} />
        <span className="bg-gray-200 px-2 py-1 rounded">{answer}</span>
        <span dangerouslySetInnerHTML={{ __html: after.replace("{given}", `<strong>${given}</strong>`) }} />
      </div>
    );
  };

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
            <div className="text-lg">{renderSentence(userAnswer)}</div>
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
            <div className="text-lg">{renderSentence(currentExercise.answer)}</div>
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
            <h3 className="font-medium text-sm">Word Formation Patterns:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Common Suffixes</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>-er/-or (teach → teacher)</li>
                  <li>-ment (develop → development)</li>
                  <li>-tion (educate → education)</li>
                  <li>-ness (happy → happiness)</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Word Families</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>act → action → active → actively</li>
                  <li>create → creative → creator → creation</li>
                  <li>help → helpful → helpless → helper</li>
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

IncorrectFillFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    type: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    sentence: PropTypes.string.isRequired,
    given: PropTypes.string.isRequired,
    suffix: PropTypes.string,
    hintWord: PropTypes.string
  }).isRequired,
  userAnswer: PropTypes.string.isRequired,
  onGotIt: PropTypes.func.isRequired,
};

export default IncorrectFillFeedback;