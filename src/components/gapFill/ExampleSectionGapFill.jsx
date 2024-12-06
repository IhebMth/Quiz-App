import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import gapFillExercises from "./gapFillExercises.json";

const ExampleItem = ({ word, blanks, explanation, image, pattern, soundClue, commonWords }) => {
  const letters = word.split("");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
        <img src={image} alt={word} className="w-32 h-32 object-contain rounded-lg" />
        <div className="space-y-4">
          <div className="flex items-center text-3xl">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`w-10 h-10 flex items-center justify-center mx-1 ${
                  blanks.includes(index)
                    ? "text-blue-600 font-bold border-b-2 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">{pattern}</p>
            <p className="text-blue-600 italic">{soundClue}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-gray-700">{explanation}</p>
        <div>
          <span className="text-sm font-medium text-gray-600">Common words: </span>
          <span className="text-sm text-gray-600">{commonWords.join(", ")}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ExampleSectionGapFill = ({ children }) => {
  const [mode, setMode] = useState("practice");
  const [activeSection, setActiveSection] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "practice" ? "example" : "practice"));

  const ExampleContent = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-gray-200 mb-8">
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {gapFillExercises.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeSection === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {gapFillExercises.sections[activeSection].title}
          </h2>
          <p className="text-gray-600 mb-6">
            {gapFillExercises.sections[activeSection].description}
          </p>

          <div className="space-y-6">
            {gapFillExercises.sections[activeSection].examples.map((example, index) => (
              <ExampleItem key={index} {...example} />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Key Learning Points:</h3>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Focus on letter patterns and how they affect word pronunciation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Use similar words (word families) to identify patterns</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Pay attention to sound clues and common examples</span>
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
        className="flex items-center gap-2 px-4 py-2 mx-auto mb-4 text-lg font-medium text-blue-600 border-b-2 border-blue-600 transition-colors hover:text-blue-700 hover:border-blue-700"
      >
        {mode === "practice" ? "Learn with examples" : "Back to practice"}
        {mode === "practice" ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
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

ExampleItem.propTypes = {
  word: PropTypes.string.isRequired,
  blanks: PropTypes.arrayOf(PropTypes.number).isRequired,
  explanation: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
  soundClue: PropTypes.string.isRequired,
  commonWords: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ExampleSectionGapFill.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExampleSectionGapFill;
