import PropTypes from "prop-types";
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from "lucide-react";

const ExerciseOrderControls = ({ exercises, setExercises, isOpen, onClose }) => {
  const moveExercise = (index, direction) => {
    const newExercises = [...exercises];
    let newIndex;
  
    switch (direction) {
      case "top": {
        if (index === 0) return;
        const [exercise] = newExercises.splice(index, 1);
        newExercises.unshift(exercise);
        break;
      }
      case "bottom": {
        if (index === exercises.length - 1) return;
        const [exToBottom] = newExercises.splice(index, 1);
        newExercises.push(exToBottom);
        break;
      }
      case "up": {
        if (index === 0) return;
        newIndex = index - 1;
        [newExercises[index], newExercises[newIndex]] = [
          newExercises[newIndex],
          newExercises[index],
        ];
        break;
      }
      case "down": {
        if (index === exercises.length - 1) return;
        newIndex = index + 1;
        [newExercises[index], newExercises[newIndex]] = [
          newExercises[newIndex],
          newExercises[index],
        ];
        break;
      }
      default:
        break;
    }
  
    setExercises(newExercises);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-2xl w-[900px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900">Reorder Exercises</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div 
                key={exercise.id} 
                className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-base font-semibold text-blue-700 shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-900 font-medium leading-relaxed pr-4">
                      {exercise.question}
                    </p>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200 group-hover:border-blue-200">
                    <button
                      onClick={() => moveExercise(index, "top")}
                      disabled={index === 0}
                      className="p-2 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move to top"
                    >
                      <ChevronsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveExercise(index, "up")}
                      disabled={index === 0}
                      className="p-2 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveExercise(index, "down")}
                      disabled={index === exercises.length - 1}
                      className="p-2 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveExercise(index, "bottom")}
                      disabled={index === exercises.length - 1}
                      className="p-2 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Move to bottom"
                    >
                      <ChevronsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ExerciseOrderControls.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      question: PropTypes.string.isRequired,
    })
  ).isRequired,
  setExercises: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExerciseOrderControls;