import PropTypes from 'prop-types';

const FinalResults = ({ results, exercises, onRestart }) => {
  const calculateTotalTime = () => {
    if (results.times.length === 0) return 0;
    return results.times.reduce((acc, time) => acc + time, 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600">
          Quiz Results
        </h2>

        {/* Score and Time Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-1">Final Score</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {Math.round(results.finalScore)} / 100
            </p>
          </div>
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-1">Total Time</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {formatTime(calculateTotalTime())}
            </p>
          </div>
        </div>

        {/* Correct/Wrong Answer Summary */}
        <div className="space-y-3 sm:space-y-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 text-sm sm:text-base font-medium">Correct Answers</span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {results.correctAnswers} 
            </span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg">
            <span className="text-red-600 text-sm sm:text-base font-medium">Wrong Answers</span>
            <span className="text-xl sm:text-2xl font-bold text-red-600">
              {results.wrongAnswers}
            </span>
          </div>
        </div>

        {/* Detailed Question Times */}
        <div className="space-y-3 sm:space-y-6 mb-6 sm:mb-8">
          {results.times.map((time, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4"
            >
              <span className="text-gray-600 text-sm sm:text-base font-medium">
                {exercises[index] ? (
                  <div className="flex items-center gap-2">
                    <span className="min-w-[20px] h-5 flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold rounded">
                      {index + 1}
                    </span>
                    <span className="line-clamp-2 sm:line-clamp-1">
                      {exercises[index].question}
                    </span>
                  </div>
                ) : (
                  'Unknown Question'
                )}
              </span>
              <span className="text-lg sm:text-xl font-bold text-blue-600 ml-7 sm:ml-0">
                {formatTime(time)}
              </span>
            </div>
          ))}
        </div>

        {/* Try Again Button */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md text-base sm:text-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

FinalResults.propTypes = {
  results: PropTypes.shape({
    times: PropTypes.arrayOf(PropTypes.number).isRequired,
    correctAnswers: PropTypes.number.isRequired,
    wrongAnswers: PropTypes.number.isRequired,
    finalScore: PropTypes.number.isRequired,
  }).isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default FinalResults;