import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import tableExercises from "./tableExercises.json";

const ExampleItem = ({ title, content, examples, tips }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-4"
    >
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-700">{content}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Examples:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {examples.map((example, index) => (
                <li key={index} className="text-gray-600">{example}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tips:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-gray-600">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExampleTableSection = ({ children }) => {
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
          {tableExercises.sections.map((section, index) => (
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
            {tableExercises.sections[activeSection].title}
          </h2>
          <p className="text-gray-600 mb-6">
            {tableExercises.sections[activeSection].description}
          </p>

          <div className="space-y-6">
            {tableExercises.sections[activeSection].examples.map((example, index) => (
              <ExampleItem key={index} {...example} />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Key Learning Points:</h3>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Understand how to organize information effectively</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Learn proper document structure and formatting</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1.5">•</span>
              <span>Practice identifying appropriate sections for different types of content</span>
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
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  examples: PropTypes.arrayOf(PropTypes.string).isRequired,
  tips: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ExampleTableSection.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExampleTableSection;