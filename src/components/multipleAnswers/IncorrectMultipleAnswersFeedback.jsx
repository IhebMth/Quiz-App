import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertCircle, Volume2 } from 'lucide-react';

const AudioPlayer = ({ word }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={playAudio}
      disabled={isPlaying}
      aria-live="polite"
      className={`p-2 rounded-full ${isPlaying ? 'bg-blue-100' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
    >
      <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-blue-600' : 'text-blue-500'}`} />
    </button>
  );
};

AudioPlayer.propTypes = {
  word: PropTypes.string.isRequired,
};

const MetallicRibbon = ({ text, color, gradientFrom, gradientTo }) => (
  <div className="block absolute -top-3 right-8 sm:right-1/4">
    <div className={`relative min-w-24 sm:min-w-32 w-auto h-auto p-2 sm:p-3 ${color} flex items-center justify-center shadow-lg rotate-0`}>
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

const IncorrectMultipleAnswersFeedback = ({ isVisible, currentExercise, selectedAnswers, onGotIt }) => {
  if (!isVisible) return null;

  const selectedOptions = currentExercise.options.filter((_, index) => selectedAnswers.includes(index));
  const correctOptions = currentExercise.options.filter(option => option.isCorrect);

  const renderOption = (option, isCorrect = false, index) => {
    return (
      <div 
        key={`${option.word}-${index}-${isCorrect}`} 
        className={`flex items-center gap-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'} p-3 rounded-lg`}
      >
        {option.image && (
          <img
            src={option.image}
            alt={option.word}
            className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
          />
        )}
        <span className={`text-lg sm:text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {option.word}
        </span>
        <AudioPlayer word={option.word} />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto p-2 sm:p-4"
    >
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6" />
          <h2 className="text-lg sm:text-3xl font-semibold">Sorry, Incorrect</h2>
        </div>

        {/* Your Answers Section */}
        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
          <MetallicRibbon 
            text="Your Answers" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8 space-y-3">
            {selectedOptions.map((option, index) => renderOption(option, false, `selected-${index}`))}
          </div>
        </div>

        {/* Correct Answers Section */}
        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
          <MetallicRibbon 
            text="Correct Answers" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8 space-y-3">
            {correctOptions.map((option, index) => renderOption(option, true, `correct-${index}`))}
          </div>
        </div>

        {/* Exercise Type Specific Feedback */}
        {currentExercise.type === "sound_matching" && (
          <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Sound Pattern" 
              color="bg-blue-600" 
              gradientFrom="blue-400" 
              gradientTo="blue-800" 
            />
            <div className="mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-sm sm:text-base">
                  The correct answers share the same ending sound: &apos;{correctOptions[0].endSound}&apos;
                </p>
              </div>
            </div>
          </div>
        )}

        {currentExercise.type === "synonym" && (
          <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
            <MetallicRibbon 
              text="Explanation" 
              color="bg-blue-600" 
              gradientFrom="blue-400" 
              gradientTo="blue-800" 
            />
            <div className="mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-sm sm:text-base">
                  Remember: Synonyms are words that have the same or nearly the same meaning.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onGotIt}
          className="flex justify-center w-32 sm:w-48 p-2 mx-auto bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          Got It
        </button>
      </div>
    </motion.div>
  );
};

IncorrectMultipleAnswersFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    type: PropTypes.oneOf(['sound_matching', 'synonym']).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      word: PropTypes.string.isRequired,
      image: PropTypes.string,
      isCorrect: PropTypes.bool.isRequired,
      endSound: PropTypes.string,
      audio: PropTypes.bool
    })).isRequired,
    question: PropTypes.string.isRequired,
    requiredSelections: PropTypes.number.isRequired
  }).isRequired,
  selectedAnswers: PropTypes.arrayOf(PropTypes.number).isRequired,
  onGotIt: PropTypes.func.isRequired
};

export default IncorrectMultipleAnswersFeedback;