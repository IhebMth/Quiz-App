// GapFill.jsx
import { useState, useEffect, useRef, createRef } from "react";
import { Volume2 } from "lucide-react";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectGapFill from "./IncorrectGapFillFeedback";
import exercisesData from "./gapFillExercises.json";

export default function GapFill() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  const inputRefs = useRef([]);
  const exercises = exercisesData.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  useEffect(() => {
    if (currentExercise) {
      setUserAnswers(new Array(currentExercise.word.length).fill(""));
      inputRefs.current = currentExercise.blanks.map(() => createRef());
    }
  }, [currentExerciseIndex]);

  const handleInputChange = (index, value) => {
    const newValue = value.toLowerCase().trim();
    const newAnswers = [...userAnswers];
    newAnswers[index] = newValue;
    setUserAnswers(newAnswers);

    // Auto-advance to next input if available
    if (newValue && currentExercise) {
      const currentBlankIndex = currentExercise.blanks.indexOf(index);
      if (currentBlankIndex < currentExercise.blanks.length - 1) {
        const nextInputRef = inputRefs.current[currentBlankIndex + 1];
        nextInputRef?.current?.focus();
      }
    }
  };

  const playAudio = () => {
    if (!currentExercise) return;
    
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentExercise.word);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      console.error("Error playing audio");
    };
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = () => {
    if (!currentExercise) return;

    const word = currentExercise.word.toLowerCase();
    const isAnswerCorrect = currentExercise.blanks.every(
      (blankIndex) => userAnswers[blankIndex] === word[blankIndex]
    );

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    // Format the answer display
    const formattedUserAnswer = currentExercise.word
      .split("")
      .map((letter, index) =>
        currentExercise.blanks.includes(index) ? userAnswers[index] || "_" : letter
      )
      .join("");

    const formattedCorrectAnswer = currentExercise.word
      .split("")
      .map((letter, index) =>
        currentExercise.blanks.includes(index) ? `[${letter}]` : letter
      )
      .join("");

    // Always add the current question to results
    const currentQuestionResult = {
      question: currentExercise.question,
      userAnswer: formattedUserAnswer,
      correctAnswer: formattedCorrectAnswer,
      isCorrect: isAnswerCorrect,
      explanation: currentExercise.explanation,
    };

    // Update results with the current question
    const newResults = {
      questions: [...results.questions, currentQuestionResult],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAnswerCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAnswerCorrect ? 0 : 1),
      finalScore: (results.correctAnswers + (isAnswerCorrect ? 1 : 0)) * pointsPerQuestion,
    };

    setResults(newResults);
    setScore((results.correctAnswers + (isAnswerCorrect ? 1 : 0)) * pointsPerQuestion);

    if (isAnswerCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex((prev) => prev + 1);
          setTimeElapsed(0); // Reset timer for next question
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkAnswer();
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setTimeElapsed(0); // Reset timer for next question
    } else {
      setShowFinalResults(true);
    }
  };

  const handleRestart = () => {
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
    setUserAnswers([]);
  };

  const renderWord = () => {
    if (!currentExercise) return null;

    return currentExercise.word.split("").map((letter, index) => {
      if (currentExercise.blanks.includes(index)) {
        return (
          <input
            key={index}
            ref={inputRefs.current[currentExercise.blanks.indexOf(index)]}
            type="text"
            maxLength={1}
            value={userAnswers[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-8 h-8 text-center border-b-2 border-blue-500 mx-1 focus:outline-none focus:border-blue-700"
          />
        );
      }
      return (
        <span key={index} className="w-8 h-8 text-center mx-1 inline-block">
          {letter}
        </span>
      );
    });
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="gapFill"
        onRestart={handleRestart}
      />
    );
  }

  if (!currentExercise) {
    return <div>No exercises available</div>;
  }

  const hasAnswers = userAnswers.some(
    (answer, index) => currentExercise.blanks.includes(index) && answer.trim() !== ""
  );

  return (
    <div className="relative bg-white pt-5">
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex-1 w-full">
          <div className="max-w-[1000px] mx-auto">
            <div className="sm:min-h-[75vh] relative overflow-hidden">
              <div className="block sm:hidden mb-6">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start m-5 sm:mt-20">
                <div className="flex flex-col flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">
                    {currentExercise.question}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={playAudio}
                      disabled={isPlaying}
                      className={`p-3 rounded-full ${
                        isPlaying ? "bg-blue-100" : "bg-blue-50"
                      } hover:bg-blue-100 transition-colors`}
                      aria-label={isPlaying ? "Playing audio" : "Play word pronunciation"}
                    >
                      <Volume2
                        className={`w-6 h-6 ${
                          isPlaying ? "text-blue-600" : "text-blue-500"
                        }`}
                      />
                    </button>

                    <img
                      src={currentExercise.image}
                      alt={currentExercise.word}
                      className="w-32 h-32 object-contain"
                    />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-2xl flex items-center justify-center">
                      {renderWord()}
                    </div>

                    <div className="flex justify-center mt-8">
                      <button
                        type="submit"
                        disabled={!hasAnswers}
                        className="
                          bg-gradient-to-r from-blue-500 to-blue-600
                          hover:from-blue-600 hover:to-blue-700
                          disabled:from-gray-400 disabled:to-gray-500
                          text-white font-semibold sm:py-4 py-2 px-10
                          rounded-xl text-lg
                          transform transition-all duration-200
                          hover:-translate-y-1 hover:shadow-lg
                          disabled:hover:translate-y-0
                          disabled:hover:shadow-none
                          disabled:cursor-not-allowed
                          sm:w-auto mt-8
                        "
                      >
                        Check Answer
                      </button>
                    </div>
                  </form>
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
                isVisible={showFeedback && isCorrect}
                isCorrect={isCorrect}
                questionNumber={currentExerciseIndex + 1}
              />

              <IncorrectGapFill
                isVisible={showIncorrectFeedback}
                currentExercise={{
                  answer: currentExercise.word,
                  explanation: currentExercise.explanation,
                  sentence: currentExercise.sentence,
                  solve: currentExercise.solve,
                  wordFamily: currentExercise.wordFamily,
                  image: currentExercise.image,
                  blanks: currentExercise.blanks,
                }}
                userAnswer={userAnswers.join("")}
                onGotIt={handleGotIt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}