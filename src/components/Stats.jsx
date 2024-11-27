import PropTypes from 'prop-types';

const Stats = ({ questionNumber, totalQuestions, timeElapsed, score }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full rounded-lg shadow-sm mb-4 sm:mb-0">
      {/* Mobile View - Grid Layout */}
      <div className="grid grid-cols-3 border border-gray-300 bg-gray-100 sm:hidden">
        {/* Questions Answered Section */}
        <div className="flex flex-col w-full border-r-4" style={{ borderColor: 'white' }}>
          <div className="p-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-800">Questions</p>
          </div>
          <div className="p-2 flex items-center justify-center border-b-4 border-green-500">
            <p className="text-lg font-semibold" style={{ color: '#16a34a' }}>
              {questionNumber} / {totalQuestions}
            </p>
          </div>
        </div>
        {/* Time Elapsed Section */}
        <div className="flex flex-col w-full border-r-4" style={{ borderColor: 'white' }}>
          <div className="p-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-800">Time</p>
          </div>
          <div className="p-2 flex items-center justify-center border-b-4 border-blue-500">
            <p className="text-lg font-semibold" style={{ color: '#3b82f6' }}>
              {formatTime(timeElapsed)}
            </p>
          </div>
        </div>
        {/* SmartScore Section */}
        <div className="flex flex-col w-full">
          <div className="p-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-800">SmartScore</p>
          </div>
          <div className="p-2 flex items-center justify-center border-b-4" style={{ borderColor: '#E76836' }}>
            <p className="text-lg font-semibold" style={{ color: '#E76836' }}>
              {Math.round(score)} / 100
            </p>
          </div>
        </div>
      </div>

      {/* Desktop View - Vertical Layout */}
      <div className="hidden sm:flex flex-col items-center space-y-2 bg-gray-100 border border-gray-100 ml-5 rounded-lg w-full">
  {/* Questions Answered Section */}
  <div className="flex flex-col items-center w-full">
    <p
      className="text-sm font-bold text-white px-2 py-1 w-full text-center"
      style={{ backgroundColor: '#16a34a' }}
    >
      Questions<br />Answered
    </p>
    <p
      className="text-lg font-semibold mt-2 text-black flex items-center justify-center"
      style={{ height: '4rem', lineHeight: '4rem' }} // Adjusting height and line-height
    >
      {questionNumber} / {totalQuestions}
    </p>
  </div>

  {/* Time Elapsed Section */}
  <div className="flex flex-col items-center w-full mt-4">
    <p
      className="text-sm font-bold text-white px-2 py-1 w-full text-center"
      style={{ backgroundColor: '#3b82f6' }}
    >
      Time<br />Elapsed
    </p>
    <p
      className="text-lg font-semibold mt-2 text-black flex items-center justify-center"
      style={{ height: '4rem', lineHeight: '4rem' }}
    >
      {formatTime(timeElapsed)}
    </p>
  </div>

  {/* SmartScore Section */}
  <div className="flex flex-col items-center w-full mt-4">
    <p
      className="text-sm font-bold text-white px-2 py-1 w-full text-center"
      style={{ backgroundColor: '#E76836' }}
    >
      SmartScore<br />Out of 100
    </p>
    <p
      className="text-lg font-semibold mt-2 text-black flex items-center justify-center"
      style={{ height: '4rem', lineHeight: '4rem' }}
    >
      {Math.round(score)} / 100
    </p>
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