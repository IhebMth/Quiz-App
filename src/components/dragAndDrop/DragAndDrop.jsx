import { useState, useEffect } from 'react';
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import DraggableItem from './DraggableItem';
import DroppableZone from './DroppableZone';
import Feedback from '../dragAndDrop/FeedBack';
import Stats from '../Stats';
import FinalResults from '../FinalResults';
import exercisesData from './data/dragAndDropExercises.json';

const DragAndDrop = () => {
    // Initialize sensors for both mouse and touch interactions
    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
            distance: 10,
        },
    });
    
    const touchSensor = useSensor(TouchSensor, {
        // Require the touch to move by 10 pixels before activating
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    // Combine both sensors
    const sensors = useSensors(mouseSensor, touchSensor);

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [categoryItems, setCategoryItems] = useState({});
    const [movedItems, setMovedItems] = useState(new Set());
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState({
        questions: [],
        times: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        finalScore: 0
    });

    const currentExercise = exercisesData.exercises[currentExerciseIndex];
    const totalExercises = exercisesData.exercises.length;
    const pointsPerQuestion = 100 / totalExercises;

    useEffect(() => {
        if (currentExercise) {
            const initialCategories = {};
            currentExercise.categories.forEach(category => {
                initialCategories[category] = [];
            });
            setCategoryItems(initialCategories);
            setMovedItems(new Set());
        }
    }, [currentExerciseIndex]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!showFeedback && !showFinalResults) {
                setTimeElapsed(prev => prev + 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [showFeedback, showFinalResults]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const draggedItemId = active.id;
        const targetCategory = over.id;

        let sourceCategory = null;
        Object.entries(categoryItems).forEach(([category, items]) => {
            if (items.some(item => item.id === draggedItemId)) {
                sourceCategory = category;
            }
        });

        if (!sourceCategory) {
            const draggedItem = currentExercise.options.find(item => item.id === draggedItemId);
            if (draggedItem) {
                setMovedItems(prev => new Set([...prev, draggedItemId]));
                setCategoryItems(prev => ({
                    ...prev,
                    [targetCategory]: [...prev[targetCategory], draggedItem]
                }));
            }
        } else if (sourceCategory !== targetCategory) {
            setCategoryItems(prev => {
                const draggedItem = prev[sourceCategory].find(item => item.id === draggedItemId);
                return {
                    ...prev,
                    [sourceCategory]: prev[sourceCategory].filter(item => item.id !== draggedItemId),
                    [targetCategory]: [...prev[targetCategory], draggedItem]
                };
            });
            setMovedItems(prev => new Set([...prev, draggedItemId]));
        }
    };

    const getAllPlacedItems = () => {
        return Object.values(categoryItems).reduce((acc, items) => acc + items.length, 0);
    };

    const checkAnswers = () => {
        let isAllCorrect = true;
        
        Object.entries(categoryItems).forEach(([category, items]) => {
            items.forEach(item => {
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
                    isCorrect: isAllCorrect
                }
            ],
            times: [...results.times, timeElapsed],
            correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
            wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1)
        };

        setResults(newResults);
        setIsCorrect(isAllCorrect);
        setShowFeedback(true);

        if (isAllCorrect) {
            setScore(prev => prev + pointsPerQuestion);
        }

        setTimeout(() => {
            setShowFeedback(false);
            if (currentExerciseIndex + 1 < totalExercises) {
                setCurrentExerciseIndex(prev => prev + 1);
                setTimeElapsed(0);
            } else {
                setShowFinalResults(true);
            }
        }, 2000);
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
            finalScore: 0
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
                    finalScore: score
                }}
                exercises={exercisesData.exercises}  
                onRestart={handleRestart}
            />
        );
    }

    const placedItems = new Set(
        Object.values(categoryItems)
            .flat()
            .map(item => item.id)
    );

    return (
        <>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="p-2 sm:p-4 max-w-4xl mx-auto">
                <h1 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 sm:mb-6">
                    {currentExercise.question}
                </h1>
                <Stats
                    questionNumber={currentExerciseIndex + 1}
                    totalQuestions={totalExercises}
                    timeElapsed={timeElapsed}
                    score={score}
                />
                <Feedback
                    isVisible={showFeedback}
                    isCorrect={isCorrect}
                />
                
                {/* Mobile-optimized draggable items section */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-8">
                    {currentExercise.options.map((item) => (
                        <div key={item.id} className="flex-1 min-w-[150px] sm:min-w-[200px]">
                            {!placedItems.has(item.id) ? (
                                <DraggableItem
                                    id={item.id}
                                    text={item.content}
                                    className={`transition-all duration-500 ease-in-out ${
                                        movedItems.has(item.id) ? 'bg-yellow-300 transform scale-105' : ''
                                    }`}
                                />
                            ) : (
                                <div className="p-4 sm:p-6 bg-gray-200 rounded-md text-center text-gray-400">
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile-optimized droppable zones grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-6 mb-4 sm:mb-8">
                    {currentExercise.categories.map((category) => (
                        <DroppableZone
                            key={category}
                            id={category}
                            label={category}
                            items={categoryItems[category] || []}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={checkAnswers}
                        disabled={getAllPlacedItems() !== currentExercise.options.length}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-md text-base sm:text-lg w-full sm:w-[200px] transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </DndContext>
        </>
    );
};


export default DragAndDrop;