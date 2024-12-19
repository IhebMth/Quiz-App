import { useState, useEffect } from 'react';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import FinalResults from '../FinalResults';
import IncorrectTableFeedback from './IncorrectTableFeedback';
import exercisesData from './tableExercises.json';

export default function TableExercise() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

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

  const handleAnswerSelect = (rowIndex, columnId) => {
    setUserAnswers(prev => ({
      ...prev,
      [rowIndex]: columnId
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const allCorrect = currentExercise.rows.every(
      (row, index) => userAnswers[index] === row.correctAnswer
    );

    setIsCorrect(allCorrect);
    setShowFeedback(true);

    const currentResults = {
      question: currentExercise.question,
      userAnswer: currentExercise.rows.map((_, index) => userAnswers[index] || ""),
      correctAnswer: currentExercise.rows.map(row => row.correctAnswer),
      isCorrect: allCorrect,
      explanation: currentExercise.explanation
    };

    const newResults = {
      questions: [...results.questions, currentResults],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (allCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (allCorrect ? 0 : 1),
      finalScore: (results.correctAnswers + (allCorrect ? 1 : 0)) * pointsPerQuestion,
    };

    setResults(newResults);
    setScore(newResults.finalScore);

    if (allCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex(prev => prev + 1);
          setUserAnswers({});
          setTimeElapsed(0);
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswers({});
      setTimeElapsed(0);
    } else {
      setShowFinalResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setTimeElapsed(0);
    setScore(0);
    setShowFinalResults(false);
    setUserAnswers({});
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="table"
        onRestart={handleRestart}
      />
    );
  }

  if (!currentExercise) {
    return <div>No exercises available</div>;
  }

  const canSubmit = currentExercise.rows.every((_, index) => userAnswers[index]);

  return (
    <div className="relative bg-white pt-5">
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex-1 w-full">
          <div className="max-w-[1000px] mx-auto px-2 min-[375px]:px-4">
            <div className="sm:min-h-[75vh] relative overflow-hidden">
              <div className="block sm:hidden mb-6">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start sm:mt-20">
                <div className="flex flex-col flex-1 w-full">
                  <h1 className="text-sm min-[375px]:text-base sm:text-2xl font-bold text-green-600 mb-4">
                    {currentExercise.question}
                  </h1>

                  <div className="overflow-x-auto -mx-2 sm:mx-0">
                    <div className="inline-block min-w-full sm:px-2">
                      <div className="min-w-[300px] bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                        <table className="w-full border-collapse table-fixed">
                          <thead>
                            <tr>
                              <th className="w-[50%] p-2 min-[375px]:p-3 sm:p-4 text-left bg-gradient-to-r from-[#33b5e5] to-[#2d9ed4] text-white rounded-tl-xl ">
                                <span className="block text-xs min-[375px]:text-sm sm:text-base text-center font-bold">Items</span>
                              </th>
                              <th 
                                colSpan={currentExercise.columns.length} 
                                className="w-[100%] p-5 min-[375px]:p-3 sm:p-4 text-center bg-gradient-to-r from-[#33b5e5] to-[#2d9ed4] text-white rounded-tr-xl"
                              >
                                <span className="block text-xs min-[375px]:text-sm sm:text-base font-bold">Sections</span>
                              </th>
                            </tr>
                            <tr>
                              <th className="w-[60%] p-2 min-[375px]:p-3 sm:p-4 text-left bg-[#33b5e5] text-white border-t-2 border-white">
                                <span className="sr-only">Category</span>
                              </th>
                              {currentExercise.columns.map((column, index) => (
                                <th 
                                  key={column.id} 
                                  style={{ width: `${40/currentExercise.columns.length}%` }}
                                  className={`p-2 min-[375px]:p-3 sm:p-4 text-center bg-[#33b5e5] text-white border-t-2 border-white ${index > 0 ? 'border-l-2' : ''}`}
                                >
                                  <div className="flex items-center justify-center min-h-[40px] sm:min-h-[48px]">
                                    <span className="text-xs  font-medium px-1">
                                      {column.label.split(' ').map((word, i) => (
                                        <span key={i} className="block leading-tight">
                                          {word}
                                        </span>
                                      ))}
                                    </span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentExercise.rows.map((row, rowIndex) => (
                              <tr 
                                key={rowIndex} 
                                className="transition-colors duration-200 even:bg-blue-50 hover:bg-blue-100"
                              >
                                <td className="w-[60%] p-2 min-[375px]:p-3 sm:p-4 border-t border-blue-100">
                                  <span className="block text-xs break-words">
                                    {row.text}
                                  </span>
                                </td>
                                {currentExercise.columns.map((column, colIndex) => (
                                  <td 
                                    key={column.id} 
                                    style={{ width: `${40/currentExercise.columns.length}%` }}
                                    className={`p-2 min-[375px]:p-3 sm:p-4 border-t border-blue-100 text-center ${colIndex > 0 ? 'border-l border-blue-100' : ''}`}
                                  >
                                    <div className="flex justify-center items-center">
                                      <input
                                        type="radio"
                                        name={`row-${rowIndex}`}
                                        checked={userAnswers[rowIndex] === column.id}
                                        onChange={() => handleAnswerSelect(rowIndex, column.id)}
                                        className="w-3 h-3 sm:w-4 sm:h-4 text-[#33b5e5] cursor-pointer focus:ring-[#33b5e5] transition-transform duration-200 hover:scale-110"
                                      />
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={checkAnswers}
                      disabled={!canSubmit}
                      className="
                        bg-[#33b5e5]
                        hover:bg-[#28a0d4]
                        disabled:bg-gray-400
                        text-white font-semibold 
                        sm:py-4 py-2 px-6 sm:px-10
                        rounded-xl text-sm sm:text-lg
                        transform transition-all duration-200
                        hover:-translate-y-1 hover:shadow-lg
                        disabled:hover:translate-y-0
                        disabled:hover:shadow-none
                        disabled:cursor-not-allowed
                        sm:w-auto
                      "
                    >
                      Check Answer
                    </button>
                  </div>
                </div>

                <div className="hidden md:block md:sticky md:top-4 ml-8 px-5">
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

              <IncorrectTableFeedback
                isVisible={showIncorrectFeedback}
                currentExercise={currentExercise}
                userAnswers={userAnswers}
                onGotIt={handleGotIt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}