import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import IncorrectSingleAnswerFeedback from './IncorrectSingleAnswerFeedback';
import FinalResults from '../FinalResults';
import exercisesData from './singleAnswerExercises.json';

export default function SingleAnswer() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  const allExercises = [
    ...exercisesData.syllableExercises.map(ex => ({ ...ex, exerciseType: 'syllable' })),
    ...exercisesData.rhymingExercises.map(ex => ({ ...ex, exerciseType: 'rhyme' }))
  ];
  
  const currentExercise = allExercises[currentExerciseIndex];
  const totalExercises = allExercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

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
    setHighlightedWord(word);
    
    try {
      await speak(word, { rate: 0.8, pitch: 1 });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
      setHighlightedWord(null);
    }
  };

  const playAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
  
    try {
      if (currentExercise.exerciseType === "syllable") {
        setHighlightedWord(currentExercise.word);
        await speak(currentExercise.word, { rate: 0.8, pitch: 1 });
        await new Promise(resolve => setTimeout(resolve, 300));
  
        for (const syllable of currentExercise.syllables) {
          await speak(syllable, { rate: 0.7, pitch: 1.05, volume: 1.2 });
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setHighlightedWord(null);
      } else {
        await speak(currentExercise.targetWord, { rate: 0.8, pitch: 1 });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        for (const option of currentExercise.options) {
          setHighlightedWord(typeof option === 'object' ? option.word : option.toString());
          await speak(typeof option === 'object' ? option.word : option.toString(), { rate: 0.8, pitch: 1 });
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        setHighlightedWord(null);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const isAnswerCorrect = currentExercise.exerciseType === "syllable"
      ? selectedAnswer === currentExercise.correctAnswer
      : currentExercise.options[selectedAnswer].isCorrect;

    setIsCurrentAnswerCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          isCorrect: isAnswerCorrect,
          userAnswer: selectedAnswer,
          exerciseType: currentExercise.exerciseType,
          correctAnswer: currentExercise.exerciseType === "syllable"
            ? currentExercise.correctAnswer
            : currentExercise.options.findIndex(opt => opt.isCorrect),
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAnswerCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAnswerCorrect ? 0 : 1),
      finalScore: isAnswerCorrect ? score + pointsPerQuestion : score,
    };

    setResults(newResults);

    if (isAnswerCorrect) {
      setShowFeedback(true);
      setScore(prev => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const renderRhymingExercise = () => (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-row items-center justify-between">
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex items-center text-blue-500 px-4 py-2 rounded-lg transition-opacity ${
            isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span className="ml-2 text-sm">
          </span>
        </button>
        <p className="text-gray-600 text-sm">
          Find a word that rhymes with &quot;{currentExercise.targetWord}&quot;
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {currentExercise.options.map((option, index) => (
          <div key={index} className="relative">
            <div
              onClick={() => handleOptionSelect(index)}
              className={`
                w-full relative group transition-all duration-200 cursor-pointer
                ${selectedAnswer === index ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
                rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md
              `}
            >
              <div className="aspect-square relative">
                <img
                  src={option.image || ''}
                  alt={typeof option === 'object' ? option.word : option}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-2 flex items-center justify-between bg-gray-50">
                <span className="text-sm font-medium text-gray-700">
                  {typeof option === 'object' ? option.word : option}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playWordAudio(typeof option === 'object' ? option.word : option.toString());
                  }}
                  className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSyllableExercise = () => (
    <>
      <div className="flex flex-row items-center mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`flex items-center text-blue-500 px-4 py-2 rounded-lg transition-opacity ${
              isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <div className="relative ml-4">
          <img 
            src={currentExercise.image}
            alt={currentExercise.word}
            className={`w-48 h-48 object-cover rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 ${
              highlightedWord === currentExercise.word ? 'ring-4 ring-yellow-400' : ''
            }`}
            onClick={() => playWordAudio(currentExercise.word)}
          />
          <button
            onClick={() => playWordAudio(currentExercise.word)}
            className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-6 max-w-xs mx-auto">
        {currentExercise.options.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`
              w-14 h-14 rounded-lg text-lg font-bold transition-all duration-200 cursor-pointer flex items-center justify-center
              ${
                selectedAnswer === option
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {option}
          </div>
        ))}
      </div>
    </>
  );

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={allExercises}
        onRestart={() => {
          setCurrentExerciseIndex(0);
          setTimeElapsed(0);
          setScore(0);
          setShowFinalResults(false);
          setResults({
            questions: [],
            times: [],
            correctAnswers: 0,
            wrongAnswers: 0,
            finalScore: 0,
          });
          setSelectedAnswer(null);
        }}
      />
    );
  }

  return (
    <div className="relative bg-white pt-3 sm:pt-5 px-2 sm:px-4">
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex-1 w-full">
          <div className="max-w-[1000px] mx-auto">
            <div className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
              <div className="block sm:hidden mb-4">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-10">
                <div className="flex flex-col flex-1 w-full">
                  <h1 className="text-lg sm:text-xl font-bold text-green-600 mb-4">
                    {currentExercise.question}
                  </h1>

                  {currentExercise.exerciseType === "syllable" 
                    ? renderSyllableExercise()
                    : renderRhymingExercise()
                  }

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={checkAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed mx-2 sm:mx-0"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                <div className="hidden sm:block ml-8">
                  <Stats
                    questionNumber={currentExerciseIndex + 1}
                    totalQuestions={totalExercises}
                    timeElapsed={timeElapsed}
                    score={score}
                  />
                </div>
              </div>

              <Feedback
                isVisible={showFeedback}
                isCorrect={isCurrentAnswerCorrect}
                questionNumber={currentExerciseIndex + 1}
              />

              <IncorrectSingleAnswerFeedback
                isVisible={showIncorrectFeedback}
                currentExercise={currentExercise}
                selectedAnswer={selectedAnswer}
                onGotIt={() => {
                  setShowIncorrectFeedback(false);
                  setSelectedAnswer(null);
                  if (currentExerciseIndex + 1 < totalExercises) {
                    setCurrentExerciseIndex(prev => prev + 1);
                  } else {
                    setShowFinalResults(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}