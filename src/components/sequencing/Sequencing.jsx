import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  rectSwappingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import SortableItem from "./SortableItem";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectSequencingFeedback from "./IncorrectSequencingFeedback";
import exercisesData from './sequencingExercises.json';

export default function Sequence() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
        delay: 0,
        tolerance: 5,
      }
    }),
    useSensor(KeyboardSensor)
  );

  const currentExercise = exercisesData.exercises[currentExerciseIndex];
  const totalExercises = exercisesData.exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  useEffect(() => {
    setItems(currentExercise.options);
  }, [currentExerciseIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    document.body.classList.add('dragging');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
    document.body.classList.remove('dragging');
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.classList.remove('dragging');
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);
    
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setResults(prev => ({
        ...prev,
        finalScore: score,
      }));
      setShowFinalResults(true);
    }
  };

  const checkAnswer = () => {
    const isSequenceCorrect = items.every((item, index) =>
      item.order === index + 1
    );
    
    setIsCorrect(isSequenceCorrect);
    setShowFeedback(true);

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          isCorrect: isSequenceCorrect,
          userAnswer: items.map(item => item.content),
          correctAnswer: currentExercise.correctOrder,
          explanation: currentExercise.solution,
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isSequenceCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isSequenceCorrect ? 0 : 1),
      finalScore: isSequenceCorrect ? score + pointsPerQuestion : score,
    };
    
    setResults(newResults);

    if (isSequenceCorrect) {
      setScore(prev => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentExerciseIndex < totalExercises - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const getContainerStyle = (type) => {
    if (type === 'phrases') {
      return "flex flex-col flex-nowrap overflow-x-auto gap-2 sm:gap-3 items-start min-h-[100px] p-3 sm:p-6 bg-blue-50/80 rounded-xl backdrop-blur-sm border border-gray-100 scrollbar-hide";
    }
    
    if (type === 'image-word') {
      const itemCount = items.length;
      const gridCols = itemCount <= 4 
        ? `grid-cols-${itemCount}` 
        : 'grid-cols-4 sm:grid-cols-6';
      return `grid ${gridCols} gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl backdrop-blur-sm border border-gray-100 w-48 sm:w-72`;
    }

    return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-6 bg-blue-50/80 rounded-xl backdrop-blur-sm border border-gray-100 w-full";
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercisesData.exercises}
        exerciseType="sequencing"
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
        }}
      />
    );
  }

  return (
    <div className="relative pt-3 sm:pt-5">
      <div className="relative max-w-[1400px] mx-auto px-3 sm:px-5">
        <div className="flex-1 w-full">
          <div className="max-w-[1000px] mx-auto">
            <div className="sm:min-h-[75vh] relative overflow-hidden">
              <div className="block sm:hidden mb-4 sm:mb-6">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between bg-white items-start mx-2 sm:m-5 p-3 sm:p-5 sm:mt-20 rounded-xl shadow-lg">
                <div className="flex flex-col flex-1 w-full">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-3 sm:mb-4">
                    {currentExercise.question}
                  </h1>

                  {currentExercise.contentType === "mixed" && (
                    <img
                      src={currentExercise.image}
                      alt="Exercise"
                      className="mb-4 sm:mb-8 mx-auto rounded-lg shadow-md max-w-full h-auto max-h-[200px] sm:max-h-[300px]"
                    />
                  )}

                  <div className="space-y-4 sm:space-y-6">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragCancel={handleDragCancel}
                      modifiers={[restrictToWindowEdges]}
                    >
                      <div className="text-base sm:text-lg">
                        <SortableContext
                          items={items}
                          strategy={currentExercise.type === 'phrases' 
                            ? horizontalListSortingStrategy 
                            : rectSwappingStrategy}
                        >
                          <div className={getContainerStyle(currentExercise.type)}>
                            {items.map((item) => (
                              <SortableItem
                                key={item.id}
                                id={item.id}
                                content={item.content}
                                type={currentExercise.type}
                                isActive={item.id === activeId}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    </DndContext>

                    <div className="flex justify-center mt-4 sm:mt-8">
                      <button
                        onClick={checkAnswer}
                        className="
                          bg-gradient-to-r from-blue-500 to-blue-600
                          hover:from-blue-600 hover:to-blue-700
                          text-white font-semibold py-2 sm:py-4 px-6 sm:px-10
                          rounded-xl text-base sm:text-lg
                          transform transition-all duration-200
                          hover:-translate-y-1 hover:shadow-lg
                          active:translate-y-0 active:shadow-md
                          w-full sm:w-auto
                        "
                      >
                        Check Answer
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block ml-8 p-4">
                  <Stats
                    questionNumber={currentExerciseIndex + 1}
                    totalQuestions={totalExercises}
                    timeElapsed={timeElapsed}
                    score={score}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Feedback
        isVisible={showFeedback && isCorrect}
        isCorrect={isCorrect}
        questionNumber={currentExerciseIndex + 1}
      />

      <IncorrectSequencingFeedback
        isVisible={showIncorrectFeedback}
        currentExercise={currentExercise}
        userAnswer={items.map(item => item.content)}
        onGotIt={handleGotIt}
      />
    </div>
  );
}