import { useState, useEffect, useRef } from "react";
import ExercisesData from "./highlightExercises.json";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectHighlightFeedback from "./IncorrectHighlightFeedback";
import { X } from 'lucide-react';

export default function Highlight() {
  const exercises = ExercisesData.exercises;
  const inputRef = useRef(null);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [corrections, setCorrections] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  const hasSelection = () => {
    if (currentExercise.type === "pronouns") {
      return Object.keys(corrections).length > 0;
    }
    return selectedItems.size > 0;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVowelClick = (char, index) => {
    const newSelected = new Set(selectedItems);
    const key = `${char}-${index}`;

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const handleWordClick = (word, index, event) => {
    if (currentExercise.type === "pronouns") {
      event.stopPropagation();
      setSelectedWord({ word, index });
      setShowInput(true);
      if (!corrections[`${word}-${index}`]) {
        setCorrections(prev => ({
          ...prev,
          [`${word}-${index}`]: ""
        }));
      }
    } else {
      const newSelected = new Set(selectedItems);
      let key;
      
      if (currentExercise.type === "redundant-phrase") {
        // For redundant-phrase, create a unique key with word and index
        key = `${word}-${index}`;
      } else if (currentExercise.type === "redundant" || currentExercise.type === "nouns") {
        // For other types, keep just the clean word as before
        key = word.replace(/[.,!?]/g, '');
      }
      
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      setSelectedItems(newSelected);
    }
  };

  const handleCorrectionChange = (e, word, index) => {
    setCorrections(prev => ({
      ...prev,
      [`${word}-${index}`]: e.target.value
    }));
  };

  const handleCorrectionKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowInput(false);
    }
  };

  const closeCorrection = () => {
    setShowInput(false);
    if (selectedWord) {
      const key = `${selectedWord.word}-${selectedWord.index}`;
      if (!corrections[key]) {
        setCorrections(prev => {
          const newCorrections = { ...prev };
          delete newCorrections[key];
          return newCorrections;
        });
      }
    }
  };

  const checkAnswer = () => {
    let isAnswerCorrect = false;
    let hasIncorrectSelections = false;
    let userAnswer = "";
    let correctAnswer = "";

    if (currentExercise.type === "vowels") {
      const selectedVowels = Array.from(selectedItems).map(item => item.split("-")[0]);
      const targetVowelCounts = currentExercise.targets.reduce((acc, vowel) => {
        acc[vowel] = (acc[vowel] || 0) + 1;
        return acc;
      }, {});

      const selectedVowelCounts = selectedVowels.reduce((acc, vowel) => {
        acc[vowel] = (acc[vowel] || 0) + 1;
        return acc;
      }, {});

      isAnswerCorrect =
        Object.keys(targetVowelCounts).every(vowel =>
          selectedVowelCounts[vowel] === targetVowelCounts[vowel]
        ) &&
        Object.keys(selectedVowelCounts).every(vowel =>
          targetVowelCounts[vowel] === selectedVowelCounts[vowel]
        );

      hasIncorrectSelections =
        !isAnswerCorrect ||
        Object.keys(selectedVowelCounts).some(vowel => !targetVowelCounts[vowel]);

      userAnswer = selectedVowels.join(",");
      correctAnswer = currentExercise.targets.join(",");
    } else if (currentExercise.type === "pronouns") {
        // Get the target corrections from the exercise
        const targetCorrections = currentExercise.targets.reduce((acc, target) => {
          acc[target.word] = target.correction;
          return acc;
        }, {});
  
        // Get the user's corrections
        const userCorrections = Object.entries(corrections).reduce((acc, [key, value]) => {
          const word = key.split("-")[0];
          acc[word] = value;
          return acc;
        }, {});
  
        // Check if the user has provided exactly the required corrections
        const hasExactTargets = Object.keys(targetCorrections).length === Object.keys(userCorrections).length;
        
        if (hasExactTargets) {
          // Check if all target words are corrected properly
          isAnswerCorrect = Object.entries(targetCorrections).every(([word, correction]) =>
            userCorrections[word]?.toLowerCase() === correction.toLowerCase()
          );
        } else {
          isAnswerCorrect = false;
        }
  
        userAnswer = JSON.stringify(userCorrections);
        correctAnswer = JSON.stringify(targetCorrections)
        
      } else if (currentExercise.type === "redundant" || currentExercise.type === "nouns") {
      const selectedWords = Array.from(selectedItems);
      const targetWords = currentExercise.targets.map(target => target.toLowerCase());

      // Convert selected words to lowercase for case-insensitive comparison
      const selectedWordsLower = selectedWords.map(word => word.toLowerCase());

      // Check if all selected words are in the target words
      const allSelectionsAreCorrect = selectedWordsLower.every(word =>
        targetWords.includes(word)
      );

      // Check if all target words are in the selected words
      const allTargetsAreSelected = targetWords.every(target =>
        selectedWordsLower.includes(target)
      );

      // Both conditions must be true for the answer to be correct
      isAnswerCorrect = allSelectionsAreCorrect && allTargetsAreSelected;
      
      // Only mark as having incorrect selections if the user selected words that aren't targets
      hasIncorrectSelections = !allSelectionsAreCorrect;

      userAnswer = selectedWordsLower.join(",");
      correctAnswer = targetWords.join(",");
    } else  if (currentExercise.type === "redundant-phrase") {
        // Get all selected words without indices
        const selectedWords = Array.from(selectedItems).map(item => {
          const [word] = item.split("-");
          return word.toLowerCase();
        });
    
        // Create a Set of unique selected words
        const uniqueSelectedWords = new Set(selectedWords);
        
        // Convert targets to lowercase for case-insensitive comparison
        const targetWords = currentExercise.targets.map(target => target.toLowerCase());
    
        // Check if all selected words are in targets
        const allSelectionsAreCorrect = Array.from(uniqueSelectedWords).every(word =>
          targetWords.includes(word)
        );
    
        // Check if all targets are in selected words
        const allTargetsAreSelected = targetWords.every(target =>
          uniqueSelectedWords.has(target)
        );
    
        isAnswerCorrect = allSelectionsAreCorrect && allTargetsAreSelected;
        hasIncorrectSelections = !allSelectionsAreCorrect;
    
        userAnswer = Array.from(uniqueSelectedWords).join(",");
        correctAnswer = targetWords.join(",");
      }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect && !hasIncorrectSelections) {
      setShowFeedback(true);
      const newScore = score + pointsPerQuestion;
      setScore(newScore);
      updateResults(true, userAnswer, correctAnswer, newScore);
      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
      updateResults(false, userAnswer, correctAnswer, score);
    }
  };

  const updateResults = (isCorrect, userAnswer, correctAnswer, newScore) => {
    setResults(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { isCorrect, userAnswer, correctAnswer }
      ],
      times: [...prev.times, timeElapsed],
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (!isCorrect ? 1 : 0),
      finalScore: newScore,
    }));
  };

  const moveToNextQuestion = () => {
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setShowFinalResults(true);
    }
  };

  const resetQuestionState = () => {
    setSelectedItems(new Set());
    setSelectedWord(null);
    setCorrections({});
    setShowInput(false);
  };

  const renderVowels = () => {
    const text = currentExercise.text;
    return text.split("").map((char, index) => (
      <span
        key={index}
        onClick={() => handleVowelClick(char, index)}
        className={`
          cursor-pointer px-0.5 py-1 rounded inline-block
          transition-all duration-200 transform
          hover:text-blue-500 hover:scale-125
          ${selectedItems.has(`${char}-${index}`) ? "text-blue-500" : ""}
        `}
      >
        {char}
      </span>
    ));
  };

  const renderWords = () => {
    const words = currentExercise.text.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      const key = currentExercise.type === "redundant-phrase"
        ? `${cleanWord}-${index}`
        : cleanWord;
 
      return (
        <span key={index} className="relative inline-block mr-3 mb-2 group mt-8">
          {/* Correction display */}
          {currentExercise.type === "pronouns" &&
           corrections[`${cleanWord}-${index}`] &&
           !showInput && (
            <div className="absolute left-1/2 transform -translate-x-1/2 bg-blue-50 px-2 py-1 rounded text-sm text-blue-600 whitespace-nowrap"
                 style={{
                   top: '-32px'
                 }}>
              {corrections[`${cleanWord}-${index}`]}
            </div>
          )}
          
          {/* Word itself */}
          <span
            onClick={(e) => handleWordClick(cleanWord, index, e)}
            className={`
              cursor-pointer px-1 py-1
              transition-all duration-200
              ${currentExercise.type === "pronouns"
                ? `hover:text-red-500
                   ${selectedWord?.index === index ? "text-red-500" : ""}
                   ${corrections[`${cleanWord}-${index}`] ? "text-red-500" : ""}`
                : currentExercise.type === "redundant-phrase"
                  ? `hover:line-through hover:text-gray-700
                     ${selectedItems.has(key) ? "line-through text-gray-400" : ""}`
                  : `hover:border-b-2 hover:border-blue-400 hover:border-dashed
                     ${selectedItems.has(cleanWord) ? "border-b-2 border-blue-500" : ""}`
              }
            `}
          >
            {word}
          </span>

          {/* Input popup */}
          {currentExercise.type === "pronouns" &&
           selectedWord?.index === index &&
           showInput && (
            <div
              ref={inputRef}
              className="absolute z-10 shadow-lg rounded-lg p-2 border border-gray-200 bg-white left-1/2 transform -translate-x-1/2"
              style={{
                bottom: 'calc(100% + 8px)'
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={corrections[`${cleanWord}-${index}`] || ""}
                  onChange={(e) => handleCorrectionChange(e, cleanWord, index)}
                  onKeyDown={handleCorrectionKeyDown}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-32 pr-8"
                  placeholder="Correction..."
                  autoFocus
                />
                <button
                  onClick={closeCorrection}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="absolute w-3 h-3 bg-white transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r border-gray-200"></div>
            </div>
          )}
        </span>
      );
    });
  }

  const renderText = () => {
    switch (currentExercise.type) {
      case "vowels":
        return renderVowels();
      case "nouns":
      case "redundant":
      case "pronouns":
      case "redundant-phrase":
        return renderWords();
      default:
        return null;
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="highlight"
        onRestart={() => {
          setCurrentExerciseIndex(0);
          setTimeElapsed(0);
          setScore(0);
          setShowFinalResults(false);
          resetQuestionState();
          setResults({
            questions: [],
            times: [],
            correctAnswers: 0,
            wrongAnswers: 0,
            finalScore: 0,
          });
        }}
      />
    );
  }

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

                  <div className="text-2xl mb-8 p-4 bg-gray-50 rounded-lg relative leading-relaxed">
                    {renderText()}
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={checkAnswer}
                      disabled={!hasSelection()}
                      className="
                        bg-gradient-to-r from-blue-500 to-blue-600
                        hover:from-blue-600 hover:to-blue-700
                        disabled:from-gray-400 disabled:to-gray-500
                        text-white font-semibold sm:py-4 py-2 px-10
                        rounded-xl text-lg
                        transform transition-all duration-200
                        hover:-translate-y-1 hover:shadow-lg
                        sm:w-auto
                      "
                    >
                      Check Answers
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
                isCorrect={isCorrect}
                questionNumber={currentExerciseIndex + 1}
                explanation={currentExercise.explanation}
              />

              <IncorrectHighlightFeedback
                isVisible={showIncorrectFeedback}
                currentExercise={currentExercise}
                selectedItems={selectedItems}
                onGotIt={moveToNextQuestion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}