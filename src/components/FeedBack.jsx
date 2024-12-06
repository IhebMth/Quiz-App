import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const getFeedbackMessage = (questionNumber) => {
  const messages = [
    { text: "Good job! You're doing great!", emoji: "✨" },
    { text: "Fantastic! Keep up the momentum!", emoji: "🌟" },
    { text: "Brilliant work!", emoji: "✨" },
    { text: "Outstanding progress!", emoji: "🌟" },
    { text: "Excellent work!", emoji: "✨" },
    { text: "Well done!", emoji: "🌟" },
    { text: "Amazing work!", emoji: "✨" },
    { text: "Spectacular!", emoji: "🌟" },
    { text: "Magnificent!", emoji: "✨" },
    { text: "Perfect!", emoji: "🌟" }
  ];
 
  return messages[Math.min(questionNumber - 1, messages.length - 1)];
};

const Feedback = ({ isVisible, isCorrect, questionNumber }) => {
  if (!isVisible) return null;
  const message = getFeedbackMessage(questionNumber);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      {isCorrect && (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm relative">
          <motion.div
            className="absolute inset-0 bg-blue-50/50 rounded-lg"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <div className="text-4xl mb-1">{message.emoji}</div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-1">Question {questionNumber}</h2>
              <p className="text-gray-600">{message.text}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

Feedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  questionNumber: PropTypes.number.isRequired,
};

export default Feedback;