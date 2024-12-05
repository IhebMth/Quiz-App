import { useState, useEffect } from "react";
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import DroppableZone from "./DroppableZone";
import Feedback from "../dragAndDrop/FeedBack";
import Stats from "../Stats";
import FinalResults from "../FinalResults";
import exercisesData from "./data/dragAndDropExercises.json";
import IncorrectFeedback from "./InCorrectAnswerFeedBackComponent";

const DragAndDrop = () => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 0,
      tolerance: 0,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [categoryItems, setCategoryItems] = useState({});
  const [movedItems, setMovedItems] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  const { sensoryExamples } = exercisesData;
  const currentExercise = exercisesData.exercises[currentExerciseIndex] || {};
  const totalExercises = exercisesData.exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  // Reset state when exercise changes
  useEffect(() => {
    if (currentExercise) {
      const initialCategories = {};
      currentExercise.categories.forEach((category) => {
        initialCategories[category] = [];
      });
      setCategoryItems(initialCategories);
      setMovedItems(new Set());
      setTimeElapsed(0);
    }
  }, [currentExerciseIndex]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const draggedItemId = active.id;

    // Handle dropping outside any zone (return to initial state)
    if (!over) {
      let sourceCategory = null;
      Object.entries(categoryItems).forEach(([category, items]) => {
        if (items.some((item) => item.id === draggedItemId)) {
          sourceCategory = category;
        }
      });

      if (sourceCategory) {
        setCategoryItems((prev) => ({
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(
            (item) => item.id !== draggedItemId
          ),
        }));
        setMovedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(draggedItemId);
          return newSet;
        });
      }
      return;
    }

    const targetCategory = over.id;

    // Check if item is already in a category
    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === draggedItemId)) {
        sourceCategory = category;
      }
    });

    // Handle moving from initial pool to category
    if (!sourceCategory) {
      const draggedItem = currentExercise.options?.find(
        (item) => item.id === draggedItemId
      );
      if (draggedItem) {
        setCategoryItems((prev) => ({
          ...prev,
          [targetCategory]: [...prev[targetCategory], draggedItem],
        }));
        setMovedItems((prev) => new Set(prev).add(draggedItemId));
      }
    }
    // Handle moving between categories
    else if (sourceCategory !== targetCategory) {
      setCategoryItems((prev) => {
        const draggedItem = prev[sourceCategory].find(
          (item) => item.id === draggedItemId
        );
        return {
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(
            (item) => item.id !== draggedItemId
          ),
          [targetCategory]: [...prev[targetCategory], draggedItem],
        };
      });
    }
  };

  const getAllPlacedItems = () => {
    return Object.values(categoryItems).reduce(
      (acc, items) => acc + items.length,
      0
    );
  };

  // Reset an individual item to initial state
  const handleResetItem = (itemId) => {
    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === itemId)) {
        sourceCategory = category;
      }
    });

    if (sourceCategory) {
      setCategoryItems((prev) => ({
        ...prev,
        [sourceCategory]: prev[sourceCategory].filter(
          (item) => item.id !== itemId
        ),
      }));
      setMovedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const checkAnswers = () => {
    let isAllCorrect = true;
    Object.entries(categoryItems).forEach(([category, items]) => {
      items.forEach((item) => {
        if (item.category !== category) {
          isAllCorrect = false;
        }
      });
    });

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          question: currentExercise.question,
          isCorrect: isAllCorrect,
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1),
    };

    setResults(newResults);
    setIsCorrect(isAllCorrect);

    if (isAllCorrect) {
      setShowCorrectFeedback(true);
      setScore((prev) => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowCorrectFeedback(false);
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex((prev) => prev + 1);
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
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setTimeElapsed(0);
    setScore(0);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    setShowFinalResults(false);
    setCategoryItems({});
    setMovedItems(new Set());
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={{
          ...results,
          finalScore: score,
        }}
        exercises={exercisesData.exercises}
        exerciseType="dragAndDrop"
        onRestart={handleRestart}
      />
    );
  }

  const placedItems = new Set(
    Object.values(categoryItems)
      .flat()
      .map((item) => item.id)
  );

  return (
    <div className="min-h-screen sm:p-4">
      <div className="relative flex sm:p-12 max-w-[1400px] mx-auto">
        <div className="hidden sm:block absolute top-8 right-3 z-10 w-[100px]">
          <Stats
            questionNumber={currentExerciseIndex + 1}
            totalQuestions={totalExercises}
            timeElapsed={timeElapsed}
            score={score}
          />
        </div>

        <div className="flex-1 sm:pr-[80px] w-full">
          <div className="relative w-full">
            <div className="sm:hidden w-full">
              <Stats
                questionNumber={currentExerciseIndex + 1}
                totalQuestions={totalExercises}
                timeElapsed={timeElapsed}
                score={score}
              />
            </div>

            <div className="max-w-[1000px] mx-auto w-full">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <h1 className="text-xl mx-4 sm:text-3xl font-bold text-green-600 mb-8">
                  {currentExercise.question}
                </h1>
                
                <Feedback
                  isVisible={showCorrectFeedback}
                  isCorrect={isCorrect}
                  questionNumber={currentExerciseIndex + 1}
                />
                
                <IncorrectFeedback
                  isVisible={showIncorrectFeedback}
                  currentExercise={currentExercise}
                  userAnswers={categoryItems}
                  onGotIt={handleGotIt}
                  sensoryExamples={sensoryExamples}
                />

                <div className="grid grid-cols-2 px-5 gap-4  sm:gap-6 mb-8 w-full  sm:px-10">
                  {currentExercise.options.map((item) =>
                    !placedItems.has(item.id) ? (
                      <div
                        key={item.id}
                        className={`transform transition-all duration-300
                          hover:-translate-y-1 
                          ${movedItems.has(item.id) ? "scale-105" : ""}
                          w-full
                        `}
                      >
                        <DraggableItem
                          id={item.id}
                          content={item.content}
                          type={item.type || "text"}
                          label={item.label}
                        />
                      </div>
                    ) : (
                      <>
                      <div
                      key={item.id}
                      className={`p-3 rounded-md text-center h-10 w-full max-w-64 mx-auto ${
                        item.type === "text" || !item.type ? "bg-gray-200 text-gray-400" : ""
                      }`}
                    >
                      <span></span>
                      </div>
                      </>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-8 w-full px-2">
                  <div className="flex flex-row gap-3 sm:gap-8 w-full ">
                    {currentExercise.categories.map((category) => (
                      <DroppableZone
                        key={category}
                        id={category}
                        label={category}
                        items={categoryItems[category] || []}
                        onResetItem={handleResetItem}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={checkAnswers}
                    disabled={getAllPlacedItems() !== currentExercise.options.length}
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
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;