import { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import IncorrectMultipleAnswersFeedback from './IncorrectMultipleAnswersFeedback';
import FinalResults from '../FinalResults';
import exercisesData from './multipleAnswersExercises.json';

export default function MultipleAnswers() {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [results, setResults] = useState({
        questions: [],
        times: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        finalScore: 0,
    });

    const allExercises = [
        ...exercisesData.soundMatchingExercises.map(ex => ({ ...ex, exerciseType: 'sound_matching' })),
        ...exercisesData.synonymExercises.map(ex => ({ ...ex, exerciseType: 'synonym' }))
    ];
      
    const currentExercise = allExercises[currentExerciseIndex];
    const totalExercises = allExercises.length;
    const pointsPerQuestion = 100 / totalExercises;

    const getCurrentExerciseType = () => {
        if (currentExercise) {
            return currentExercise.exerciseType || currentExercise.type || 'multiple';
        }
        return 'multiple';
    };

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
        
        try {
            await speak(word, { rate: 0.8, pitch: 1 });
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const playAllAudio = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
      
        try {
            for (const option of currentExercise.options) {
                await speak(option.word, { rate: 0.8, pitch: 1 });
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const handleOptionSelect = (index) => {
        setSelectedAnswers(prev => {
            const isSelected = prev.includes(index);
            if (isSelected) {
                return prev.filter(i => i !== index);
            } else {
                if (prev.length < currentExercise.requiredSelections) {
                    return [...prev, index];
                }
                return prev;
            }
        });
    };

    const moveToNextQuestion = () => {
        setSelectedAnswers([]);
        if (currentExerciseIndex + 1 < totalExercises) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            setShowFinalResults(true);
        }
    };

    const checkAnswer = () => {
        if (selectedAnswers.length !== currentExercise.requiredSelections) return;

        const correctIndices = currentExercise.options
            .map((option, index) => option.isCorrect ? index : null)
            .filter(index => index !== null);

        const isAllCorrect = selectedAnswers.every(index => 
            correctIndices.includes(index)) && 
            selectedAnswers.length === correctIndices.length;

        const selectedWords = selectedAnswers.map(index => currentExercise.options[index].word);
        const correctWords = correctIndices.map(index => currentExercise.options[index].word);

        setIsLastAnswerCorrect(isAllCorrect);

        const newResults = {
            ...results,
            questions: [
                ...results.questions,
                {
                    question: currentExercise.question,
                    isCorrect: isAllCorrect,
                    userAnswers: selectedWords,
                    correctAnswers: correctWords,
                    exerciseType: currentExercise.exerciseType,
                },
            ],
            times: [...results.times, timeElapsed],
            correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
            wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1),
            finalScore: isAllCorrect ? score + pointsPerQuestion : score,
        };

        setResults(newResults);

        if (isAllCorrect) {
            setShowFeedback(true);
            setScore(prev => prev + pointsPerQuestion);
            setTimeout(() => {
                setShowFeedback(false);
                moveToNextQuestion();
            }, 2000);
        } else {
            setShowIncorrectFeedback(true);
        }
    };

    const handleGotIt = () => {
        setShowIncorrectFeedback(false);
        moveToNextQuestion();
    };

    const renderOption = (option, index) => {
        const isSelected = selectedAnswers.includes(index);

        if (currentExercise.exerciseType === 'sound_matching') {
            return (
                <div 
                    className={`
                        h-full cursor-pointer transition-all duration-200 bg-white rounded-lg shadow-sm
                        ${isSelected ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
                    `}
                    onClick={() => handleOptionSelect(index)}
                >
                    <div className="aspect-square w-full h-32 sm:h-40 lg:h-48 relative">
                        <img
                            src={option.image}
                            alt={option.word}
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                        />
                    </div>
                    <div className="p-2 bg-white border-t flex items-center justify-between rounded-b-lg">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                playWordAudio(option.word);
                            }}
                            className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Volume2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div 
                className={`
                    relative cursor-pointer transition-all duration-200 rounded-lg
                    ${isSelected ? 'bg-blue-200 border-blue-500' : 'bg-blue-50 border-transparent hover:bg-blue-75'}
                    border min-h-[60px] flex items-center px-4 py-3
                `}
                onClick={() => handleOptionSelect(index)}
            >
                <div className={`
                    absolute left-4 flex items-center justify-center
                    w-6 h-6 rounded-full transition-colors duration-200
                    ${isSelected ? 'bg-blue-600' : 'bg-white border-2 border-blue-400'}
                `}>
                    <Check 
                        className={`w-4 h-4 ${isSelected ? 'text-white ' : 'text-transparent'}`}
                    />
                </div>

                <span className="text-lg font-semibold text-gray-700 ml-10">
                    {option.word}
                </span>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        playWordAudio(option.word);
                    }}
                    className="absolute right-4 text-blue-500 hover:text-blue-600 transition-colors"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>
        );
    };

   if (showFinalResults) {
        return (
            <FinalResults
                results={results}
                exercises={allExercises}
                exerciseType={getCurrentExerciseType()} // Add this line
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
                    setSelectedAnswers([]);
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
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                        <h1 className="text-lg sm:text-xl font-bold text-green-600">
                                            {currentExercise.question}
                                        </h1>
                                        <button
                                            onClick={playAllAudio}
                                            disabled={isPlaying}
                                            className={`
                                                flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-500
                                                ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}
                                            `}
                                        >
                                            <Volume2 className="w-5 h-5" />
                                            <span className="ml-2 whitespace-nowrap">Listen to all</span>
                                        </button>
                                    </div>

                                    <div className={`
                                        grid gap-4 mb-8
                                        ${currentExercise.exerciseType === 'sound_matching' 
                                            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3' 
                                            : 'grid-cols-1 md:grid-cols-3'}
                                    `}>
                                        {currentExercise.options.map((option, index) => (
                                            <div key={index} className="relative">
                                                {renderOption(option, index)}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            onClick={checkAnswer}
                                            disabled={selectedAnswers.length !== currentExercise.requiredSelections}
                                            className="
                                                w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 
                                                hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 
                                                disabled:to-gray-500 text-white font-semibold py-2 sm:py-3 
                                                px-6 sm:px-8 rounded-lg text-sm sm:text-base transform 
                                                transition-all duration-200 hover:-translate-y-1 
                                                hover:shadow-lg disabled:hover:translate-y-0 
                                                disabled:hover:shadow-none disabled:cursor-not-allowed 
                                                mx-2 sm:mx-0
                                            "
                                        >
                                            Check Answer ({selectedAnswers.length}/{currentExercise.requiredSelections} selected)
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
                                isCorrect={isLastAnswerCorrect}
                                questionNumber={currentExerciseIndex + 1}
                            />
                            <IncorrectMultipleAnswersFeedback
                                isVisible={showIncorrectFeedback}
                                currentExercise={currentExercise}
                                selectedAnswers={selectedAnswers}
                                onGotIt={handleGotIt}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}