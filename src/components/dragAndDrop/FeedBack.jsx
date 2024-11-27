import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const getFeedbackMessage = (questionNumber) => {
  const messages = [
    { text: "Good job! You're doing great! 🌟", emoji: "🎯" },
    { text: "Fantastic! Keep up the momentum! 🚀", emoji: "⭐" },
    { text: "Brilliant! You're on fire! 🔥", emoji: "🎨" },
    { text: "Outstanding! You're unstoppable! 💪", emoji: "🏆" },
    { text: "Phenomenal! You're a genius! 🧠", emoji: "🎉" },
    { text: "Incredible! You're crushing it! 💫", emoji: "🔥" },
    { text: "Amazing! You're a superstar! ⭐", emoji: "🎸" },
    { text: "Spectacular! You're legendary! 👑", emoji: "🎭" },
    { text: "Magnificent! Pure excellence! 🌟", emoji: "🎪" },
    { text: "Perfect! You're extraordinary! 💎", emoji: "🎯" }
  ];
  
  return messages[Math.min(questionNumber - 1, messages.length - 1)];
};

const Feedback = ({ isVisible, isCorrect, questionNumber }) => {
  if (!isVisible) return null;

  const message = getFeedbackMessage(questionNumber);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      {isCorrect && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl shadow-2xl transform transition-all duration-500 text-white max-w-md relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
            animate={{
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="flex flex-col items-center space-y-4 relative z-10">
            <div className="text-6xl mb-2">{message.emoji}</div>
            <CheckCircle className="w-12 h-12 text-white animate-bounce" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Question {questionNumber}</h2>
              <p className="text-lg font-medium">{message.text}</p>
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