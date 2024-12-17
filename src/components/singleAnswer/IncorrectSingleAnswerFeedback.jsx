import { motion } from 'framer-motion';
import { AlertCircle, Volume2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

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

const IncorrectSingleAnswerFeedback = ({ isVisible, currentExercise, selectedAnswer, onGotIt }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isVisible) return null;

  const speak = async (text, options = {}) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        voice => voice.lang.startsWith('en-') && voice.localService === true
      ) || voices.find(voice => voice.lang.startsWith('en-'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const playWordAudio = async (word) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      await speak(word, { rate: 0.8, pitch: 1 });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const getCorrectAnswer = () => {
    if (currentExercise.exerciseType === 'syllable') {
      return currentExercise.correctAnswer;
    } else {
      const correctOption = currentExercise.options.find(opt => opt.isCorrect);
      return correctOption ? correctOption.word : '';
    }
  };

  const getUserAnswer = () => {
    if (currentExercise.exerciseType === 'syllable') {
      return selectedAnswer;
    } else {
      const selectedOption = currentExercise.options[selectedAnswer];
      return selectedOption ? selectedOption.word : '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto p-4"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Sorry, that&apos;s not correct...</h2>
        </div>

        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Your Answer" 
            color="bg-red-500" 
            gradientFrom="red-400" 
            gradientTo="red-800" 
          />
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              {currentExercise.exerciseType === 'syllable' ? (
                <div className="text-2xl font-bold text-red-600">{getUserAnswer()} syllables</div>
              ) : (
                <>
                  <img 
                    src={currentExercise.options[selectedAnswer].image} 
                    alt={getUserAnswer()} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex items-center">
                    <span className="text-xl text-red-600 mr-2">{getUserAnswer()}</span>
                    <button
                      onClick={() => playWordAudio(getUserAnswer())}
                      className="p-2 text-red-600 hover:text-red-700"
                      disabled={isPlaying}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 border border-gray-300 p-5 relative">
          <MetallicRibbon 
            text="Correct Answer" 
            color="bg-green-600" 
            gradientFrom="green-400" 
            gradientTo="green-800" 
          />
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              {currentExercise.exerciseType === 'syllable' ? (
                <>
                  <div className="text-2xl font-bold text-green-600">
                    {getCorrectAnswer()} syllables
                  </div>
                  <div className="text-lg">
                    ({currentExercise.syllables.join(' • ')})
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={currentExercise.options.find(opt => opt.isCorrect).image} 
                    alt={getCorrectAnswer()} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex items-center">
                    <span className="text-xl text-green-600 mr-2">{getCorrectAnswer()}</span>
                    <button
                      onClick={() => playWordAudio(getCorrectAnswer())}
                      className="p-2 text-green-600 hover:text-green-700"
                      disabled={isPlaying}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

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
                <h4 className="font-medium text-sm mb-2">How to Count Syllables</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Listen for the beat or pulse in the word</li>
                  <li>Count the vowel sounds, not letters</li>
                  <li>Say the word slowly and clearly</li>
                  <li>Put your hand under your chin while speaking</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Practice Strategy</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Listen to the word multiple times</li>
                  <li>Break down the word into parts</li>
                  <li>Clap out each syllable</li>
                  <li>Write down what you hear</li>
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

IncorrectSingleAnswerFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    exerciseType: PropTypes.oneOf(['syllable', 'rhyme']).isRequired,
    word: PropTypes.string,
    syllables: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.number,
    options: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.shape({
        word: PropTypes.string,
        image: PropTypes.string,
        isCorrect: PropTypes.bool,
      }))
    ]).isRequired,
  }).isRequired,
  selectedAnswer: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onGotIt: PropTypes.func.isRequired,
};


export default IncorrectSingleAnswerFeedback;