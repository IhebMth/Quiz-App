import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertCircle, Volume2 } from 'lucide-react';

const AudioPlayer = ({ word }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

const GapFillDisplay = ({ word, blanks, userAnswers, isReadOnly = false, color = 'text-gray-700' }) => {
  const letters = word.split('');
  return (
    <div className="flex items-center flex-wrap gap-1">
      {letters.map((letter, index) => {
        const userAnswer = userAnswers[blanks.indexOf(index)];
        if (blanks.includes(index)) {
          return (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={blanks.includes(index) ? (userAnswer || '') : letter}
              readOnly={isReadOnly}
              className={`w-6 sm:w-8 h-8 text-xl text-center border-b-2 mx-0.5 
                ${isReadOnly ? 'bg-red-100' : 'border-gray-300'} 
                focus:outline-none ${color}`}
            />
          );
        }
        return (
          <span key={index} className="w-4 h-8 text-center mx-0.5 inline-flex items-center justify-center">
            {letter}
          </span>
        );
      })}
    </div>
  );
};

GapFillDisplay.propTypes = {
  word: PropTypes.string.isRequired,
  blanks: PropTypes.arrayOf(PropTypes.number).isRequired,
  userAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  isReadOnly: PropTypes.bool,
  color: PropTypes.string,
};

const WordFamilySection = ({ wordFamily, image }) => (
  <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative ">
    <MetallicRibbon 
      text="Word Family" 
      color="bg-yellow-600" 
      gradientFrom="yellow-400" 
      gradientTo="yellow-800" 
    />
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-4 min-w-0 w-full">
        {wordFamily?.map((word, index) => (
          <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
            <img src={image} alt={word} className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover" />
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl">{word}</span>
              <AudioPlayer word={word} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

WordFamilySection.propTypes = {
  wordFamily: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string.isRequired,
};

const IncorrectGapFill = ({ isVisible, currentExercise, userAnswer, onGotIt }) => {
  if (!isVisible) return null;

  const userAnswers = userAnswer.split('');

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

        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative ">
          <MetallicRibbon 
            text="Your Answer" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <img
              src={currentExercise.image}
              alt={currentExercise.answer}
              className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
            />
            <div className="flex items-center gap-3">
              <GapFillDisplay 
                word={currentExercise.answer}
                blanks={currentExercise.blanks}
                userAnswers={userAnswers}
                isReadOnly={true}
                color="text-red-600"
              />
              <AudioPlayer word={currentExercise.answer} />
            </div>
          </div>
        </div>

        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative ">
          <MetallicRibbon 
            text="Correct Answer" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8 flex flex-col sm:flex-row items-center  gap-3">
            <img
              src={currentExercise.image}
              alt={currentExercise.answer}
              className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg object-cover"
            />
            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-xl text-green-600">{currentExercise.answer}</span>
              <AudioPlayer word={currentExercise.answer} />
            </div>
          </div>
        </div>

        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative ">
          <MetallicRibbon 
            text="Word Usage" 
            color="bg-blue-600" 
            gradientFrom="blue-400" 
            gradientTo="blue-800" 
          />
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h3 className="font-medium mb-2">Example Sentence:</h3>
              <p className=" text-gray-700 text-sm sm:text-base">{currentExercise.sentence}</p>
            </div>
          </div>
        </div>

        <WordFamilySection 
          wordFamily={currentExercise.wordFamily} 
          image={currentExercise.image}
        />

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

IncorrectGapFill.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    image: PropTypes.string.isRequired,
    blanks: PropTypes.arrayOf(PropTypes.number).isRequired,
    answer: PropTypes.string.isRequired,
    sentence: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    solve: PropTypes.string.isRequired,
    wordFamily: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  userAnswer: PropTypes.string.isRequired,
  onGotIt: PropTypes.func.isRequired,
};

export default IncorrectGapFill;