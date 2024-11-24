import PropTypes from 'prop-types';

const Stats = ({ questionNumber, totalQuestions, timeElapsed, score }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-gray-600 text-sm">Question</p>
        <p className="text-xl font-semibold text-blue-600">
          {questionNumber} / {totalQuestions}
        </p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-sm">Time</p>
        <p className="text-xl font-semibold text-blue-600">
          {formatTime(timeElapsed)}
        </p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-sm">Score</p>
        <p className="text-xl font-semibold text-blue-600">
          {Math.round(score)}%
        </p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 text-sm">Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-blue-600 rounded-full h-4 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

Stats.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  timeElapsed: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Stats;
