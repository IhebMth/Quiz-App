import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ExampleSectionClickToChange = ({ children, data }) => {
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

  const ExampleItem = ({ sentence, answer, given, explanation }) => {
    const formattedSentence = sentence
      .replace('{answer}', `<span class="text-blue-500 font-medium">${answer}</span>`)
      .replace('{given}', `<strong>${given}</strong>`);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4"
      >
        <div className="mb-2">
          <span dangerouslySetInnerHTML={{ __html: formattedSentence }} />
        </div>
        <div className="text-sm text-gray-600">
          {explanation}
        </div>
      </motion.div>
    );
  };

  ExampleItem.propTypes = {
    sentence: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    given: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
  };

  const ExampleContent = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {data.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white p-6 sm:mt-14 rounded-lg border-2 border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {section.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {section.description}
          </p>

          <div className="space-y-4 mb-6">
            {section.examples.map((example, index) => (
              <ExampleItem
                key={index}
                sentence={example.sentence}
                answer={example.answer}
                given={example.given}
                explanation={example.explanation}
              />
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Key Points:</h3>
            <ul className="text-gray-700 space-y-2">
              {section.title === "Capitalization Rules" ? (
                <>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Capitalize proper nouns (names of people, places)
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Capitalize days of the week and months
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Use subject pronouns (I, he, she) as sentence subjects
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Use object pronouns (me, him, her) as objects
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto">
      <button
        onClick={toggleMode}
        className="flex items-center w-auto px-4 py-2 mx-auto text-lg font-medium text-blue-500 border-b-2 border-b-blue-500 transition-colors"
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

ExampleSectionClickToChange.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        examples: PropTypes.arrayOf(
          PropTypes.shape({
            sentence: PropTypes.string.isRequired,
            answer: PropTypes.string.isRequired,
            given: PropTypes.string.isRequired,
            explanation: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ExampleSectionClickToChange;