/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ExampleSectionSingleAnswer = ({ children, data }) => {
  const [mode, setMode] = useState("practice");
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef(null);

  const toggleMode = () => {
    setMode((prev) => (prev === "practice" ? "example" : "practice"));
  };

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  const speak = async (text, options = {}) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find(
          (voice) => voice.lang.startsWith("en-") && voice.localService === true
        ) || voices.find((voice) => voice.lang.startsWith("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const playWord = async (word, syllables) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await speak(word, { rate: 0.8, pitch: 1 });
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (syllables) {
        for (const syllable of syllables) {
          await speak(syllable, { rate: 0.7, pitch: 1.1 });
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const ExampleItem = ({ section, example }) => {
    const isSyllable = section.title === "Syllable Counting";
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4"
      >
        {isSyllable ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-medium">{example.word}</span>
              <button
                onClick={() => playWord(example.word, example.syllables)}
                disabled={isPlaying}
                className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {example.syllables.map((syllable, index) => (
                <div key={index} className="flex items-center">
                  <span className="px-3 py-1 bg-blue-100 rounded">
                    {syllable}
                  </span>
                  {index < example.syllables.length - 1 && (
                    <span className="mx-1">•</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600">{example.explanation}</p>
            <p className="text-sm text-blue-600">{example.tips}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-medium">{example.targetWord}</span>
              <button
                onClick={() => playWord(example.targetWord)}
                disabled={isPlaying}
                className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {example.rhymingWords.map((word, index) => (
                <div key={index} className="px-3 py-1 bg-green-100 rounded">
                  {word}
                </div>
              ))}
              <div className="px-3 py-1 bg-red-100 rounded">
                {example.nonRhymingWord}
              </div>
            </div>
            <p className="text-gray-600">{example.explanation}</p>
          </div>
        )}
      </motion.div>
    );
  };

  const ExampleContent = ({ sections }) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="bg-white p-6 sm:mt-14 rounded-lg border-2 border-gray-200 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {section.title}
          </h2>
          <p className="text-gray-600 mb-6">{section.description}</p>
          <div className="space-y-6 mb-6">
            {section.examples.map((example, index) => (
              <ExampleItem key={index} section={section} example={example} />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );

  ExampleItem.propTypes = {
    section: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    example: PropTypes.shape({
      word: PropTypes.string,
      syllables: PropTypes.arrayOf(PropTypes.string),
      explanation: PropTypes.string.isRequired,
      tips: PropTypes.string,
      targetWord: PropTypes.string,
      rhymingWords: PropTypes.arrayOf(PropTypes.string),
      nonRhymingWord: PropTypes.string,
    }).isRequired,
  };

  ExampleContent.propTypes = {
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        examples: PropTypes.arrayOf(PropTypes.object).isRequired,
      })
    ).isRequired,
  };

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
            <ExampleContent sections={data.sections} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ExampleSectionSingleAnswer.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        examples: PropTypes.arrayOf(PropTypes.object).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ExampleSectionSingleAnswer;