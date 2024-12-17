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

const DisplayText = ({ words, clickedWords, type, isCorrectAnswer }) => {
  return words.map((word, index) => {
    let displayText = word.text;
    let textColor = "text-gray-800";

    if (type === "pronoun" && word.isPronoun) {
      // Show pronouns in blue initially if not in correct answer view
      textColor = !isCorrectAnswer ? "text-red-500" : "text-gray-800";

      if (isCorrectAnswer) {
        // Show correct form in green for correct answer view
        displayText = word.correctForm;
        textColor = "text-green-500 font-medium";
      } else if (clickedWords.has(index)) {
        // Show selected pronouns with the correct form
        displayText = word.correctForm;
        textColor = "text-red-600 font-medium";
      }
    } else if (type === "capitalize") {
      if (isCorrectAnswer && word.shouldCapitalize) {
        displayText = word.text.charAt(0).toUpperCase() + word.text.slice(1);
        textColor = "text-green-500 font-medium";
      } else if (clickedWords.has(index)) {
        displayText = word.text.charAt(0).toUpperCase() + word.text.slice(1);
        textColor = "text-red-600 font-medium";
      }
    }

    return (
      <span
        key={index}
        className={`mx-1 p-1 rounded ${textColor}`}
      >
        {displayText}
      </span>
    );
  });
};

const IncorrectClickToChange = ({ isVisible, currentExercise, clickedWords, onGotIt }) => {
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
          <h2 className="text-xl font-semibold">Sorry, that&apos;s not correct...</h2>
        </div>

        {/* Your Answer */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Your Answer" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8">
            <div className="text-lg">
              <DisplayText
                words={currentExercise.words}
                clickedWords={clickedWords}
                type={currentExercise.type}
                isCorrectAnswer={false}
              />
            </div>
          </div>
        </div>

        {/* Correct Answer */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Correct Answer" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8">
            <div className="text-lg">
              <DisplayText
                words={currentExercise.words}
                clickedWords={new Set(currentExercise.words
                  .map((word, index) => word.isPronoun || word.shouldCapitalize ? index : null)
                  .filter(index => index !== null))}
                type={currentExercise.type}
                isCorrectAnswer={true}
              />
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Explanation" 
            color="bg-blue-600" 
            gradientFrom="blue-400" 
            gradientTo="blue-800" 
          />
          <div className="mt-8">
            <p className="text-gray-700">{currentExercise.explanation}</p>
          </div>
        </div>

        {/* Tips */}
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
                <h4 className="font-medium text-sm mb-2">Common Rules</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {currentExercise.type === 'pronoun' ? (
                    <>
                      <li>Subject pronouns: I, he, she, we, they</li>
                      <li>Object pronouns: me, him, her, us, them</li>
                      <li>Use subject pronouns after &apos;be&apos; verbs</li>
                      <li>Check pronoun-antecedent agreement</li>
                    </>
                  ) : (
                    <>
                      <li>Capitalize proper nouns</li>
                      <li>Capitalize days and months</li>
                      <li>Capitalize names of places</li>
                      <li>Capitalize first word of sentences</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Practice Strategy</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Read the sentence carefully</li>
                  <li>Identify the sentence structure</li>
                  <li>Consider the context</li>
                  <li>Double-check your answers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

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

DisplayText.propTypes = {
  words: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    isPronoun: PropTypes.bool,
    correctForm: PropTypes.string,
    shouldCapitalize: PropTypes.bool,
  })).isRequired,
  clickedWords: PropTypes.instanceOf(Set).isRequired,
  type: PropTypes.oneOf(['pronoun', 'capitalize']).isRequired,
  isCorrectAnswer: PropTypes.bool.isRequired,
};

IncorrectClickToChange.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    type: PropTypes.oneOf(['pronoun', 'capitalize']).isRequired,
    words: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      isPronoun: PropTypes.bool,
      correctForm: PropTypes.string,
      shouldCapitalize: PropTypes.bool,
    })).isRequired,
    explanation: PropTypes.string.isRequired,
  }).isRequired,
  clickedWords: PropTypes.instanceOf(Set).isRequired,
  onGotIt: PropTypes.func.isRequired,
};

export default IncorrectClickToChange;