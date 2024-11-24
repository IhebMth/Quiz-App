import PropTypes from 'prop-types';

const Feedback = ({ isVisible, isCorrect }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
      } ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <div className="flex items-center text-white">
        {isCorrect ? (
          <>
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Correct!</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">Try again!</span>
          </>
        )}
      </div>
    </div>
  );
};

Feedback.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isCorrect: PropTypes.bool.isRequired,
};

export default Feedback;
