import { useState, useEffect } from 'react';
import { Plus, Save, Upload, Trash } from 'lucide-react';

const ExerciseManager = () => {
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    type: 'sequencing',
    exerciseType: 'phrases',
    question: '',
    contentType: 'text',
    data: {
      options: [],
      correctOrder: []
    },
    solution: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optionInput, setOptionInput] = useState('');
  const [importedData, setImportedData] = useState(null);

  const exerciseTypes = {
    phrases: {
      label: 'Phrases Sequencing',
      description: 'Arrange phrases to create a story'
    },
    sentence: {
      label: 'Sentence Structure',
      description: 'Arrange words to form a sentence'
    },
    'image-word': {
      label: 'Image-Word Matching',
      description: 'Arrange letters to spell the word shown in image'
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (importedData) {
      populateFormFromImport(importedData);
    }
  }, [importedData]);

  const fetchExercises = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpSettings.apiUrl}quiz/v1/exercises?type=sequencing`, {
        headers: {
          'X-WP-Nonce': window.wpSettings.nonce
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch exercises');
      
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (exerciseId) => {
    if (!confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    try {
      const response = await fetch(`${window.wpSettings.apiUrl}quiz/v1/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          'X-WP-Nonce': window.wpSettings.nonce
        }
      });

      if (!response.ok) throw new Error('Failed to delete exercise');
      
      setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setError('Failed to delete exercise. Please try again.');
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
          setImportedData(jsonData.exercises[0]); // Load first exercise as example
        }
      } catch (e) {
        console.log(e)
        setError('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const populateFormFromImport = (exercise) => {
    setCurrentExercise({
      type: 'sequencing',
      exerciseType: exercise.type || 'phrases',
      question: exercise.question || '',
      contentType: exercise.contentType || 'text',
      data: {
        options: exercise.options || [],
        correctOrder: exercise.correctOrder || []
      },
      solution: exercise.solution || ''
    });
  };

  const addOption = () => {
    if (!optionInput.trim()) return;

    const newOption = {
      id: String(Date.now()),
      content: optionInput.trim(),
      order: currentExercise.data.options.length + 1
    };

    setCurrentExercise(prev => ({
      ...prev,
      data: {
        ...prev.data,
        options: [...prev.data.options, newOption],
        correctOrder: [...prev.data.correctOrder, optionInput.trim()]
      }
    }));

    setOptionInput('');
  };

  const removeOption = (index) => {
    setCurrentExercise(prev => ({
      ...prev,
      data: {
        ...prev.data,
        options: prev.data.options.filter((_, i) => i !== index),
        correctOrder: prev.data.correctOrder.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    const exerciseData = {
      ...currentExercise,
      question: currentExercise.question,
      type: 'sequencing',
      exerciseType: currentExercise.exerciseType,
      contentType: currentExercise.contentType,
      data: {
        options: currentExercise.data.options,
        correctOrder: currentExercise.data.correctOrder
      },
      solution: currentExercise.solution
    };

    formData.append('exercise', JSON.stringify(exerciseData));
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${window.wpSettings.apiUrl}quiz/v1/exercises`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-WP-Nonce': window.wpSettings.nonce
        }
      });
      
      if (!response.ok) throw new Error('Failed to save exercise');

      await fetchExercises();
      resetForm();
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError('Failed to save exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentExercise({
      type: 'sequencing',
      exerciseType: 'phrases',
      question: '',
      contentType: 'text',
      data: {
        options: [],
        correctOrder: []
      },
      solution: ''
    });
    setSelectedImage(null);
    setOptionInput('');
    setImportedData(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sequencing Exercise Management</h2>
        <div className="flex gap-4">
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
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
            onClick={resetForm}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Exercise
          </button>
        </div>
      </div>

      {isLoading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exercise Type</label>
            <select
              value={currentExercise.exerciseType}
              onChange={(e) => setCurrentExercise(prev => ({
                ...prev,
                exerciseType: e.target.value,
                contentType: e.target.value === 'image-word' ? 'mixed' : 'text'
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              {Object.entries(exerciseTypes).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={currentExercise.question}
              onChange={(e) => setCurrentExercise(prev => ({
                ...prev,
                question: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {currentExercise.exerciseType === 'image-word' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="mt-1 block w-full"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Add Options</label>
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
                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Options</label>
            <div className="space-y-2">
              {currentExercise.data.options.map((option, index) => (
                <div key={option.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{option.content}</span>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Solution Explanation</label>
            <textarea
              value={currentExercise.solution}
              onChange={(e) => setCurrentExercise(prev => ({
                ...prev,
                solution: e.target.value
              }))}
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
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Exercise'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Sequencing Exercises</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {exercises.length === 0 ? (
            <li className="px-6 py-4 text-gray-500">No exercises found</li>
          ) : (
            exercises.map((exercise) => (
              <li key={exercise.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exercise.exerciseType}</h4>
                    <p className="text-gray-600">{exercise.question}</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">Options:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {exercise.data.options.map((option, index) => (
                          <li key={index}>{option.content}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ExerciseManager;