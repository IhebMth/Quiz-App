import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// HighlightExample subcomponent
const HighlightExample = ({ exercise }) => {
  const renderText = () => {
    const words = exercise.text.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      const isTarget = exercise.targets.some(target =>
        typeof target === 'object'
          ? target.word === cleanWord
          : target === cleanWord
      );
      
      return (
        <span key={index} className="relative inline-block mr-3 mb-2 group mt-8">
          {exercise.type === "pronouns" && isTarget && (
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 bg-blue-50 px-2 py-1 rounded text-sm text-blue-600 whitespace-nowrap"
              style={{
                top: '-32px'
              }}
            >
              {exercise.targets.find(t => t.word === cleanWord)?.correction}
            </div>
          )}
          <span
            className={`
              cursor-pointer px-1 py-1
              transition-all duration-200
              ${isTarget
                ? exercise.type === "pronouns"
                  ? "text-red-500"
                  : exercise.type === "redundant-phrase"
                  ? "line-through text-gray-400"
                  : "border-b-2 border-blue-500"
                : ""
              }
            `}
          >
            {word}
          </span>
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4"
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        {exercise.question}
      </h3>
      <div className="text-lg mb-4 p-4 bg-gray-50 rounded-lg relative leading-relaxed">
        {renderText()}
      </div>
      <div className="text-sm text-gray-600">{exercise.explanation}</div>
    </motion.div>
  );
};

HighlightExample.propTypes = {
  exercise: PropTypes.shape({
    text: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    explanation: PropTypes.string,
    type: PropTypes.string.isRequired,
    targets: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          word: PropTypes.string.isRequired,
          correction: PropTypes.string
        })
      ])
    ).isRequired
  }).isRequired
};

// ExampleContent subcomponent
const ExampleContent = ({ data }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="overflow-hidden"
  >
    <div className="bg-white p-6 sm:mt-14 rounded-lg border-2 border-gray-200 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Text Highlighting Examples
      </h2>
      <p className="text-gray-600 mb-6">
        Here are examples of different types of text highlighting exercises.
        Each example shows how to identify and highlight specific elements in text.
      </p>
      <div className="space-y-6 mb-6">
        {Object.values(data.examples).map((exercise, index) => (
          <HighlightExample key={index} exercise={exercise} />
        ))}
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Exercise Types:</h3>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Pronouns: Identify and correct incorrect pronouns
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Redundant Phrases: Find and remove unnecessary words
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Vowels: Identify all vowels in words
          </li>
          <li className="flex items-center">
            <span className="mr-2">•</span>
            Nouns: Highlight all nouns in sentences
          </li>
        </ul>
      </div>
    </div>
  </motion.div>
);

ExampleContent.propTypes = {
  data: PropTypes.shape({
    examples: PropTypes.object.isRequired,
    exercises: PropTypes.arrayOf(PropTypes.shape(HighlightExample.propTypes.exercise)).isRequired
  }).isRequired
};

// Main ExampleSectionHighlight component
const ExampleSectionHighlight = ({ children, data }) => {
  const [mode, setMode] = useState("practice");
  const sectionRef = useRef(null);

  const toggleMode = () => {
    setMode((prev) => (prev === "practice" ? "example" : "practice"));
  };

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto">
      <button
        onClick={toggleMode}
        className="flex items-center w-auto px-4 py-2 mx-auto mb-8 text-lg font-medium text-blue-500 border-b-2 border-b-blue-500 transition-colors"
      >
        {mode === "practice" ? "Learn with examples" : "Back to practice"}
        {mode === "practice" ? (
          <ChevronDown className="w-5 h-5 ml-2" />
        ) : (
          <ChevronUp className="w-5 h-5 ml-2" />
        )}
      </button>
      <AnimatePresence mode="wait">
        {mode === "practice" ? (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="example"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ExampleContent data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ExampleSectionHighlight.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    examples: PropTypes.object.isRequired,
    exercises: PropTypes.arrayOf(PropTypes.shape(HighlightExample.propTypes.exercise)).isRequired
  }).isRequired
};

export default ExampleSectionHighlight;