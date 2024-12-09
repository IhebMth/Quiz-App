// ExampleSectionFill.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ExampleSectionFill = ({ children, data }) => {
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

  const ExampleItem = ({ sentence, answer, given }) => {
    const parts = sentence.split('{answer}');
    const [before, after] = parts;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4"
      >
        <div className="mb-2">
          <span dangerouslySetInnerHTML={{ __html: before.replace('{given}', `<strong>${given}</strong>`) }} />
          <span className="text-blue-500 font-medium px-2">{answer}</span>
          <span dangerouslySetInnerHTML={{ __html: after.replace('{given}', `<strong>${given}</strong>`) }} />
        </div>
        <div className="text-sm text-gray-600">
          Root word: <strong>{given}</strong> → Related word: <strong>{answer}</strong>
        </div>
      </motion.div>
    );
  };

  ExampleItem.propTypes = {
    sentence: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    given: PropTypes.string.isRequired,
  };

  const ExampleContent = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="bg-white p-6 sm:mt-14 rounded-lg border-2 border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Word Family Examples
        </h2>
        <p className="text-gray-600 mb-6">
          Here are some examples of how words from the same word family can be used in different contexts.
          Pay attention to how the root word changes to create related words.
        </p>

        <div className="space-y-4 mb-6">
          {data.exercises.slice(0, 3).map((exercise, index) => (
            <ExampleItem
              key={index}
              sentence={exercise.sentence}
              answer={exercise.answer}
              given={exercise.given}
            />
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Learning Points:</h3>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Words in the same family share a common root or base
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Different suffixes and prefixes create new related words
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Context helps determine which form of the word to use
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Understanding word families helps expand vocabulary
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto">
      <button
        onClick={toggleMode}
        className="flex items-center w-auto px-4 py-2 mx-auto  text-lg font-medium text-blue-500 border-b-2 border-b-blue-500 transition-colors"
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
            <ExampleContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ExampleSectionFill.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        sentence: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
        given: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ExampleSectionFill;