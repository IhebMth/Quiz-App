/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Upload,
  Trash,
  Image as ImageIcon,
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  GripVertical,
  ArrowUpDown
} from "lucide-react";
import ExerciseOrderControls from "./DashboardControls";

const Dashboard = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    type: "sequencing",
    exerciseType: "phrases",
    question: "",
    contentType: "text",
    data: {
      options: [],
      correctOrder: [],
    },
    solution: "",
    image: null,
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optionInput, setOptionInput] = useState("");
  const [importedData, setImportedData] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState(null);
  const [toast, setToast] = useState(null);
  const [isOrderingOpen, setIsOrderingOpen] = useState(false);

  const exerciseTypes = {
    phrases: {
      label: "Phrases Sequencing",
      description: "Arrange phrases to create a story",
    },
    sentence: {
      label: "Sentence Structure",
      description: "Arrange words to form a sentence",
    },
    "image-word": {
      label: "Image-Word Matching",
      description: "Arrange letters to spell the word shown in image",
    },
  };

  const Toast = ({ message, type }) => {
    const colors = {
      success: "bg-green-100 border-green-500 text-green-800",
      error: "bg-red-100 border-red-500 text-red-800",
      info: "bg-blue-100 border-blue-500 text-blue-800",
    };

    const icons = {
      success: <CheckCircle className="w-6 h-6 text-green-500" />,
      error: <AlertCircle className="w-6 h-6 text-red-500" />,
      info: <Info className="w-6 h-6 text-blue-500" />,
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 shadow-lg ${colors[type]} animate-fade-in-up`}>
          {icons[type]}
          <p className="font-medium text-lg">{message}</p>
        </div>
      </div>
    );
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (importedData) {
      populateFormFromImport(importedData);
      showToast("Exercise data imported successfully", "success");
    }
  }, [importedData]);

  useEffect(() => {
    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      setSelectedImagePreview(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [selectedImage]);

  const fetchExercises = async () => {
    setIsLoading(true);
    setError(null);

    if (typeof window.wpSettings === "undefined") {
      console.warn("window.wpSettings is undefined. Skipping fetch.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${window.wpSettings.apiUrl}quiz/v1/exercises?type=sequencing`,
        {
          headers: {
            "X-WP-Nonce": window.wpSettings.nonce,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch exercises");

      const data = await response.json();
      setExercises(data);
      showToast("Exercises loaded successfully", "info");
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Failed to load exercises. Please try again.");
      showToast("Failed to load exercises", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (typeof window.wpSettings === "undefined") {
      console.warn("window.wpSettings is undefined. Skipping delete.");
      return;
    }

    try {
      const response = await fetch(
        `${window.wpSettings.apiUrl}quiz/v1/exercises/${id}`,
        {
          method: "DELETE",
          headers: {
            "X-WP-Nonce": window.wpSettings.nonce,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete exercise");

      setExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise.id !== id)
      );
      showToast("Exercise deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting exercise:", error);
      showToast("Failed to delete exercise", "error");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData.exercises && Array.isArray(jsonData.exercises)) {
          const matchingExercise = jsonData.exercises.find(
            (exercise) => exercise.type === currentExercise.exerciseType
          );

          if (matchingExercise) {
            setImportedData(matchingExercise);
          } else {
            setError(`No exercise found with type "${currentExercise.exerciseType}"`);
            showToast(`No exercise found with type "${currentExercise.exerciseType}"`, "error");
          }
        }
      } catch (e) {
        console.error(e);
        showToast("Invalid JSON file format", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5242880) {
        showToast("Image size should be less than 5MB", "error");
        return;
      }
      setSelectedImage(file);
      setCurrentExercise((prev) => ({
        ...prev,
        contentType: "mixed",
      }));
      showToast("Image uploaded successfully", "success");
    }
  };

  const populateFormFromImport = (exercise) => {
    if (!exercise) return;

    if (exercise.type !== currentExercise.exerciseType) {
      setError(`Exercise type mismatch. Expected "${currentExercise.exerciseType}", got "${exercise.type}"`);
      showToast("Exercise type mismatch", "error");
      return;
    }

    const options = (exercise.options || []).map((option) => ({
      id: option.id,
      content: option.content,
      order: option.order,
    }));

    const correctOrder = (exercise.correctOrder || []).map((content, index) => {
      const matchingOption = options.find((opt) => opt.content === content);

      if (!matchingOption) {
        console.warn(
          `No match found for content "${content}" in options. Adding as a new entry.`
        );
      }

      return (
        matchingOption || {
          id: String(Date.now() + index),
          content: content,
          order: index + 1,
        }
      );
    });

    setCurrentExercise({
      type: exercise.type,
      exerciseType: exercise.type,
      question: exercise.question || "",
      contentType: exercise.contentType || "text",
      data: {
        options: options,
        correctOrder: correctOrder,
      },
      solution: exercise.solution || "",
      imageUrl: exercise.image || "",
    });

    setError(null);
  };

  const addOption = () => {
    if (!optionInput.trim()) return;

    const newOption = {
      id: String(Date.now()),
      content: optionInput.trim(),
      order: currentExercise.data.options.length + 1,
    };

    setCurrentExercise((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        options: [...prev.data.options, newOption],
        correctOrder: [...prev.data.correctOrder, newOption],
      },
    }));

    setOptionInput("");
    showToast("Option added successfully", "success");
  };

  const removeOption = (index) => {
    setCurrentExercise((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        options: prev.data.options.filter((_, i) => i !== index),
        correctOrder: prev.data.correctOrder.filter((_, i) => i !== index),
      },
    }));
    showToast("Option removed", "info");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;

    const newCorrectOrder = [...currentExercise.data.correctOrder];
    const draggedItem = newCorrectOrder[draggedItemIndex];

    newCorrectOrder.splice(draggedItemIndex, 1);
    newCorrectOrder.splice(index, 0, draggedItem);

    setCurrentExercise((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        correctOrder: newCorrectOrder,
      },
    }));
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    showToast("Order updated successfully", "info");
  };

  const handleExerciseDragStart = (index) => {
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedExerciseIndex === null) return;

    const newExercises = [...exercises];
    const draggedExercise = newExercises[draggedExerciseIndex];

    newExercises.splice(draggedExerciseIndex, 1);
    newExercises.splice(index, 0, draggedExercise);

    setExercises(newExercises);
    setDraggedExerciseIndex(index);
  };

  const handleExerciseDragEnd = () => {
    setDraggedExerciseIndex(null);
    showToast("Exercise order updated", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const formData = new FormData();
    
    // Restructure the options to include order property
    const options = currentExercise.data.options.map((opt, index) => ({
      id: opt.id,
      content: opt.content,
      order: index + 1  // Assign order based on current position
    }));
  
    // Create the exercise data with proper structure
    const exerciseData = {
      ...currentExercise,
      type: "sequencing",
      data: {
        options: options,
        correctOrder: currentExercise.data.correctOrder.map(opt => opt.content)
      }
    };
  
    formData.append("exercise", JSON.stringify(exerciseData));
  
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    try {
      const response = await fetch(
        `${window.wpSettings.apiUrl}quiz/v1/exercises`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-WP-Nonce": window.wpSettings.nonce,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to save exercise");
  
      await fetchExercises();
      resetForm();
      showToast("Exercise saved successfully!", "success");
    } catch (error) {
      console.error("Error saving exercise:", error);
      showToast("Failed to save exercise", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentExercise({
      type: "sequencing",
      exerciseType: "phrases",
      question: "",
      contentType: "text",
      data: {
        options: [],
        correctOrder: [],
      },
      solution: "",
      image: null,
      imageUrl: "",
    });
    setSelectedImage(null);
    setSelectedImagePreview("");
    setOptionInput("");
    setImportedData(null);
    showToast("Form reset successfully", "info");
  };

  const renderAnswerComparison = (exercise) => {
    const userOrder = exercise.data.options;
    const correctOrder = exercise.data.correctOrder;

    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-2">
              Current Order:
            </h5>
            <div className="space-y-2">
              {userOrder.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{option.content}</span>
                  <span className="text-gray-500">#{option.order}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-sm text-gray-700 mb-2">
              Correct Order:
            </h5>
            <div className="space-y-2">
              {correctOrder.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    userOrder.find((o) => o.order === index + 1)?.content ===
                    answer
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <span>{answer}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">#{index + 1}</span>
                    {userOrder.find((o) => o.order === index + 1)?.content ===
                    answer ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="font-medium text-sm text-gray-700">Solution:</h5>
          <p className="mt-1 text-gray-600">{exercise.solution}</p>
        </div>
      </div>
    );
  };

  const renderExercises = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">All Exercises</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {exercises.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">No exercises found</div>
        ) : (
          exercises.map((exercise, index) => (
            <div
              key={exercise.id}
              draggable
              onDragStart={() => handleExerciseDragStart(index)}
              onDragEnter={(e) => handleExerciseDragEnter(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleExerciseDragEnd}
              className="p-6 hover:bg-gray-50 transition-colors cursor-move group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4 flex-1">
                  <GripVertical className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-medium text-lg">
                        {exerciseTypes[exercise.exerciseType]?.label ||
                          exercise.exerciseType}
                      </h4>
                      <p className="text-gray-600 mt-1">{exercise.question}</p>
                    </div>

                    {exercise.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={exercise.imageUrl}
                          alt="Exercise"
                          className="h-32 w-auto object-cover rounded"
                        />
                      </div>
                    )}

                    {renderAnswerComparison(exercise)}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Exercise Management</h2>
        <div className="flex gap-4">
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
        onClick={() => setIsOrderingOpen(true)}
        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 mr-2" />
        Reorder
      </button>
          <button
            onClick={resetForm}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Exercise
          </button>
        </div>
      </div>

      {isLoading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exercise Type
            </label>
            <select
              value={currentExercise.exerciseType}
              onChange={(e) =>
                setCurrentExercise((prev) => ({
                  ...prev,
                  exerciseType: e.target.value,
                  contentType:
                    e.target.value === "image-word" ? "mixed" : "text",
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {Object.entries(exerciseTypes).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <input
              type="text"
              value={currentExercise.question}
              onChange={(e) =>
                setCurrentExercise((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {selectedImagePreview && (
                <div className="relative">
                  <img
                    src={selectedImagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedImagePreview("");
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Add Options
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter an option"
              />
              <button
                type="button"
                onClick={addOption}
                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Options
            </label>
            <div className="space-y-2">
              {currentExercise.data.options.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{option.content}</span>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {currentExercise.data.options.length === 0 && (
                <div className="text-gray-500 text-sm italic">
                  No options added yet
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Order (Drag to reorder)
            </label>
            <div className="space-y-2">
              {currentExercise.data.correctOrder.map((option, index) => (
                <div
                  key={option.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  className="flex items-center justify-between bg-blue-50 p-3 rounded cursor-move border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">☰</span>
                    <span>{option.content}</span>
                  </div>
                  <span className="text-gray-500 font-medium">
                    #{index + 1}
                  </span>
                </div>
              ))}
              {currentExercise.data.correctOrder.length === 0 && (
                <div className="text-gray-500 text-sm italic">
                  Add options above and drag them to set the correct order
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Solution Explanation
            </label>
            <textarea
              value={currentExercise.solution}
              onChange={(e) =>
                setCurrentExercise((prev) => ({
                  ...prev,
                  solution: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows="3"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Exercise"}
          </button>
        </div>
      </form>

      {renderExercises()}
      <ExerciseOrderControls
    exercises={exercises}
    setExercises={setExercises}
    isOpen={isOrderingOpen}
    onClose={() => setIsOrderingOpen(false)}
  />
    </div>
  );
};

export default Dashboard;