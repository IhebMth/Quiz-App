import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const MetallicRibbon = ({ text, color, gradientFrom, gradientTo }) => (
  <div className="block absolute -top-3 right-8 sm:right-1/4">
    <div className={`relative min-w-24 sm:min-w-32 w-auto h-auto p-2 sm:p-3 ${color} flex items-center justify-center shadow-lg rotate-0`}>
      <div className={`absolute inset-10 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} opacity-50`}></div>
      <span className="relative text-white font-semibold text-xs sm:text-sm tracking-wider">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
      <div className="absolute inset-y-0 right-0 w-px bg-white opacity-30"></div>
    </div>
  </div>
);

const AnswerSection = ({ title, color, gradientFrom, gradientTo, rows, columns, userAnswers, correctAnswers, isUserAnswer }) => (
  <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
    <MetallicRibbon 
      text={title} 
      color={color} 
      gradientFrom={gradientFrom} 
      gradientTo={gradientTo} 
    />
    <div className="mt-8">
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="inline-block min-w-full sm:px-2">
          <div className="min-w-[300px] bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-[50%] p-2 min-[375px]:p-3 sm:p-4 text-left bg-gradient-to-r from-[#33b5e5] to-[#2d9ed4] text-white rounded-tl-xl">
                    <span className="block text-xs min-[375px]:text-sm sm:text-base font-medium">Items</span>
                  </th>
                  <th 
                    colSpan={columns.length} 
                    className="w-[100%] p-2 min-[375px]:p-3 sm:p-4 text-center bg-gradient-to-r from-[#33b5e5] to-[#2d9ed4] text-white rounded-tr-xl"
                  >
                    <span className="block text-xs min-[375px]:text-sm sm:text-base font-medium">Sections</span>
                  </th>
                </tr>
                <tr>
                  <th className="w-[60%] p-2 min-[375px]:p-3 sm:p-4 text-left bg-[#33b5e5] text-white border-t-2 border-white">
                    <span className="sr-only">Category</span>
                  </th>
                  {columns.map((column, index) => (
                    <th 
                      key={column.id} 
                      style={{ width: `${40/columns.length}%` }}
                      className={`p-2 min-[375px]:p-3 sm:p-4 text-center bg-[#33b5e5] text-white border-t-2 border-white ${index > 0 ? 'border-l-2' : ''}`}
                    >
                      <div className="flex items-center justify-center min-h-[40px] sm:min-h-[48px]">
                        <span className="text-xs font-medium px-1">
                          {column.label.split(' ').map((word, i) => (
                            <span key={i} className="block leading-tight">
                              {word}
                            </span>
                          ))}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="transition-colors duration-200 even:bg-blue-50 hover:bg-blue-100"
                  >
                    <td className="w-[60%] p-2 min-[375px]:p-3 sm:p-4 border-t border-blue-100">
                      <span className="block text-xs break-words">
                        {row.text}
                      </span>
                    </td>
                    {columns.map((column, colIndex) => (
                      <td 
                        key={column.id} 
                        style={{ width: `${40/columns.length}%` }}
                        className={`p-2 min-[375px]:p-3 sm:p-4 border-t border-blue-100 text-center ${colIndex > 0 ? 'border-l border-blue-100' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {isUserAnswer ? (
                            userAnswers[rowIndex] === column.id && (
                              <span 
                                className={`font-bold text-lg ${
                                  userAnswers[rowIndex] === correctAnswers[rowIndex] 
                                    ? 'text-green-500' 
                                    : 'text-red-500'
                                }`}
                              >
                                {userAnswers[rowIndex] === correctAnswers[rowIndex] ? '✓' : '✗'}
                              </span>
                            )
                          ) : (
                            correctAnswers[rowIndex] === column.id && (
                              <span className="text-green-500 font-bold text-lg">✓</span>
                            )
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IncorrectTableFeedback = ({ isVisible, currentExercise, userAnswers, onGotIt }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto p-2 sm:p-4"
    >
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6" />
          <h2 className="text-lg sm:text-3xl font-semibold">Sorry, Incorrect</h2>
        </div>

        <AnswerSection 
          title="Your Answer"
          color="bg-red-500"
          gradientFrom="red-400"
          gradientTo="red-800"
          rows={currentExercise.rows}
          columns={currentExercise.columns}
          userAnswers={userAnswers}
          correctAnswers={currentExercise.rows.map(row => row.correctAnswer)}
          isUserAnswer={true}
        />

        <AnswerSection 
          title="Correct Answer"
          color="bg-green-600"
          gradientFrom="green-400"
          gradientTo="green-800"
          rows={currentExercise.rows}
          columns={currentExercise.columns}
          userAnswers={userAnswers}
          correctAnswers={currentExercise.rows.map(row => row.correctAnswer)}
          isUserAnswer={false}
        />

        <div className="space-y-4 border border-gray-300 p-3 sm:p-5 relative">
          <MetallicRibbon 
            text="Explanation" 
            color="bg-blue-600" 
            gradientFrom="blue-400" 
            gradientTo="blue-800" 
          />
          <div className="mt-8">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <p className="text-gray-700 text-sm sm:text-base">{currentExercise.explanation}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onGotIt}
          className="flex justify-center w-32 sm:w-48 p-2 mx-auto bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          Got It
        </button>
      </div>
    </motion.div>
  );
};

IncorrectTableFeedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentExercise: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        correctAnswer: PropTypes.string.isRequired
      })
    ).isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    explanation: PropTypes.string.isRequired
  }).isRequired,
  userAnswers: PropTypes.object.isRequired,
  onGotIt: PropTypes.func.isRequired
};

MetallicRibbon.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired
};

AnswerSection.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      correctAnswer: PropTypes.string.isRequired
    })
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  userAnswers: PropTypes.object.isRequired,
  correctAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  isUserAnswer: PropTypes.bool.isRequired
};

export default IncorrectTableFeedback;