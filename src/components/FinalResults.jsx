import PropTypes from 'prop-types';

const FinalResults = ({ results, exercises, onRestart }) => {
  // Calculate the total time spent on the exercise
  const calculateTotalTime = () => {
    if (results.times.length === 0) return 0;
    const totalTime = results.times.reduce((acc, time) => acc + time, 0);
    return totalTime;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Quiz Results</h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Final Score</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(results.finalScore)}%
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-600 text-sm">Total Time Spent</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatTime(calculateTotalTime())}
            </p>
          </div>
        </div>
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-green-600 font-medium">Correct Answers</span>
            <span className="text-2xl font-bold text-green-600">{results.correctAnswers}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <span className="text-red-600 font-medium">Wrong Answers</span>
            <span className="text-2xl font-bold text-red-600">{results.wrongAnswers}</span>
          </div>
        </div>
        <div className="space-y-6 mb-8">
          {/* Display time spent on each question */}
          {results.times.map((time, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">
                {exercises[index] ? exercises[index].question : `Unknown Question`}
              </span>
              <span className="text-xl font-bold text-blue-600">{formatTime(time)}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md text-lg transition-colors"
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
