import PropTypes from "prop-types";

const FinalResults = ({ results, exercises, onRestart, exerciseType }) => {
  const calculateTotalTime = () => {
    if (results.times.length === 0) return 0;
    return results.times.reduce((acc, time) => acc + time, 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFillInTheBlanks = (exercise, userAnswer) => {
    if (!exercise || !exercise.sentence) return "Question data missing";

    const formattedSentence = (exercise.sentence || "")
      .replace("{answer}", userAnswer || "___")
      .replace("{given}", `<strong>${exercise.given || "___"}</strong>`)
      .replace("{suffix}", exercise.suffix || "");

    return (
      <div>
        <span className="font-medium">{exercise.type || "Question"}: </span>
        <span dangerouslySetInnerHTML={{ __html: formattedSentence }} />
      </div>
    );
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
            <span className="text-green-600 text-sm sm:text-base font-medium">
              Correct Answers
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              {results.correctAnswers}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg">
            <span className="text-red-600 text-sm sm:text-base font-medium">
              Wrong Answers
            </span>
            <span className="text-xl sm:text-2xl font-bold text-red-600">
              {results.wrongAnswers}
            </span>
          </div>
        </div>

        {/* Detailed Question Results */}
        <div className="space-y-3 sm:space-y-6 mb-6 sm:mb-8">
          {results.questions.map((result, index) => (
            <div
              key={index}
              className="flex flex-col p-3 sm:p-4 bg-gray-50 rounded-lg gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-blue-100 text-blue-600 text-xs font-bold rounded">
                  {index + 1}
                </span>
                <div className="flex-1">
                  {/* Conditionally display details based on exercise type */}
                  {exerciseType === "fillInTheBlanks" ? (
                    formatFillInTheBlanks(exercises[index], result.userAnswer)
                  ) : exerciseType === "dragAndDrop" ? (
                    <div className="font-medium">
                      {exercises[index].question}
                    </div> // Display only the question for drag and drop exercises
                  ) : null}

                  {exercises[index]?.answer &&
                    exerciseType === "fillInTheBlanks" && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-600">
                          Correct answer:{" "}
                        </span>
                        <span className="text-green-600">
                          {exercises[index].answer}
                        </span>
                      </div>
                    )}

                  {result.userAnswer && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium text-gray-600">
                        Your answer:{" "}
                      </span>
                      <span
                        className={
                          result.isCorrect ? "text-green-600" : "text-red-600"
                        }
                      >
                        {result.userAnswer}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {formatTime(results.times[index])}
                </span>
              </div>
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
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        isCorrect: PropTypes.bool.isRequired,
        userAnswer: PropTypes.string,
      })
    ).isRequired,
    times: PropTypes.arrayOf(PropTypes.number).isRequired,
    correctAnswers: PropTypes.number.isRequired,
    wrongAnswers: PropTypes.number.isRequired,
    finalScore: PropTypes.number.isRequired,
  }).isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      question: PropTypes.string,
      sentence: PropTypes.string,
      given: PropTypes.string,
      suffix: PropTypes.string,
      answer: PropTypes.string,
    })
  ).isRequired,
  onRestart: PropTypes.func.isRequired,
  exerciseType: PropTypes.oneOf(["fillInTheBlanks", "dragAndDrop"]).isRequired,
};

export default FinalResults;
