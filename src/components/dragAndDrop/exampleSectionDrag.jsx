import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ExamplePracticeSection = ({ children }) => {
  const [mode, setMode] = useState("practice");
  const sectionRef = useRef(null);

  const examples = {
    sight: [
      {
        key: "John's face was lit by glowing firelight",
        solution: "Visual description creates an image of illuminated face",
      },
      {
        key: "purple flowers",
        solution: "Describes something visible to the eye",
      },
      {
        key: "shiny blue ribbon",
        solution: "Uses color and texture that can be seen",
      },
      {
        key: "flickering lights",
        solution: "Shows movement that can be observed",
      },
    ],
    touch: [
      {
        key: "Ted was uncomfortable in his scratchy wool sweater",
        solution: "Describes physical sensation against skin",
      },
      {
        key: "fire-hot iron",
        solution: "Temperature sensation that can be felt",
      },
    ],
    sound: [
      {
        key: "chirping birds outside her window",
        solution: "Auditory detail that can be heard",
      },
    ],
    smell: [
      {
        key: "freshly baked bread",
        solution: "Describes an aroma that can be smelled",
      },
    ],
    taste: [
      {
        key: "sharply sour apple",
        solution: "Describes flavor sensation on tongue",
      },
    ],
  };

  const exampleExercise = {
    question: "Sort these sensory details into their correct categories",
    categories: {
      Sight: [
        { id: "1", content: "Glowing firelight", category: "Sight" },
        { id: "6", content: "Sparkling stars", category: "Sight" },
      ],
      Sound: [
        { id: "2", content: "Thunder rumbling", category: "Sound" },
        { id: "7", content: "Whistling wind", category: "Sound" },
      ],
      Touch: [
        { id: "3", content: "Rough sandpaper", category: "Touch" },
        { id: "8", content: "Smooth silk", category: "Touch" },
      ],
      Smell: [
        { id: "4", content: "Fresh coffee", category: "Smell" },
        { id: "9", content: "Salty ocean breeze", category: "Smell" },
      ],
      Taste: [
        { id: "5", content: "Sweet honey", category: "Taste" },
        { id: "10", content: "Spicy pepper", category: "Taste" },
      ],
    },
  };

  const toggleMode = () => {
    const newMode = mode === "practice" ? "example" : "practice";
    setMode(newMode);

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ExampleItem = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
    >
      {text}
    </motion.div>
  );

  // Prop validation for ExampleItem
  ExampleItem.propTypes = {
    text: PropTypes.string.isRequired,
  };

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-4xl mx-auto transition-all duration-300"
    >
      <button
        onClick={toggleMode}
        className="flex items-center justify-between w-full px-4 py-2 mb-4 text-lg font-medium text-blue-500 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
      >
        {mode === "practice" ? "Learn with an example" : "Back to practice"}
        {mode === "practice" ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>

      {mode === "example" ? (
        <div className="transition-all duration-300">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {exampleExercise.question}
            </h2>
            <p className="text-gray-600 mb-6">
              Here&apos;s an example of how sensory details can be categorized
              by the sense they appeal to.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(exampleExercise.categories).map(
                ([category, items]) => (
                  <div
                    key={category}
                    className="border-2 rounded-lg transition-colors duration-200 border-blue-300 bg-white"
                  >
                    <div className="text-gray-700 font-medium text-center py-3 border-b-2 border-blue-300">
                      <span className="capitalize">{category}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({items.length} items)
                      </span>
                    </div>
                    <div className="min-h-[200px] p-4 space-y-3">
                      <AnimatePresence>
                        {items.map((item) => (
                          <ExampleItem key={item.id} text={item.content} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Learning Points:
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Each category represents one of our five senses
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Notice how specific details help create vivid mental images
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Good writing often combines multiple sensory details
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  These details make descriptions more engaging and memorable
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
            <p className="text-gray-700 mb-6">
              When you write, you can use <strong>sensory details</strong> to
              make stories and scenes easier for the reader to imagine. A
              sensory detail makes the reader imagine a particular sight, sound,
              smell, taste, or touch.
            </p>

            {Object.entries(examples).map(([sense, details]) => (
              <div key={sense} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 capitalize mb-3">
                  {sense}:
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left border border-gray-200 w-1/2">
                          Example
                        </th>
                        <th className="px-4 py-2 text-left border border-gray-200 w-1/2">
                          Explanation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border border-gray-200">
                            <strong>{detail.key}</strong>
                          </td>
                          <td className="px-4 py-2 border border-gray-200">
                            {detail.solution}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="transition-all duration-300">{children}</div>
      )}
    </div>
  );
};

ExamplePracticeSection.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExamplePracticeSection;
