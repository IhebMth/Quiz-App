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

  const renderGapFillDetails = (exercise, result) => {
    // Format the word with blanks for display
    const formatWord = () => {
      if (!exercise || !exercise.word) return null;
      
      const letters = exercise.word.split('');
      return letters.map((letter, idx) => {
        if (exercise.blanks.includes(idx)) {
          return `[${letter}]`;
        }
        return letter;
      }).join('');
    };

    return (
      <div className="text-sm">
        <div className="font-medium mb-2">{exercise.question}</div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={exercise.image}
            alt={exercise.word}
            className="w-12 h-12 object-cover rounded"
          />
          <span className="font-medium">{exercise.word}</span>
        </div>
        <div className="mb-1">
          <span className="font-medium text-gray-600">Your answer: </span>
          <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
            {result.userAnswer}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Correct answer: </span>
          <span className="text-green-600">{formatWord()}</span>
        </div>
        {!result.isCorrect && exercise.explanation && (
          <div className="mt-2 text-xs text-gray-600 italic">
            {exercise.explanation}
          </div>
        )}
      </div>
    );
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

  const renderMultipleAnswerDetails = (result) => {
    return (
      <div className="text-sm">
        <div className="font-medium mb-2">{result.question}</div>
        <div className="mb-1">
          <span className="font-medium text-gray-600">Your answers: </span>
          <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
            {result.userAnswers.join(", ")}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Correct answers: </span>
          <span className="text-green-600">{result.correctAnswers.join(", ")}</span>
        </div>
      </div>
    );
  };

  const renderSingleAnswerDetails = (exercise, result) => {
    if (exercise.exerciseType === "syllable") {
      return (
        <div className="text-sm">
          <div className="font-medium mb-2">{exercise.question}</div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={exercise.image}
              alt={exercise.word}
              className="w-12 h-12 object-cover rounded"
            />
            <span className="font-medium">{exercise.word}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium text-gray-600">Your answer: </span>
            <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
              {result.userAnswer} syllables
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Correct answer: </span>
            <span className="text-green-600">
              {exercise.correctAnswer} syllables ({exercise.syllables.join("-")})
            </span>
          </div>
        </div>
      );
    } else if (exercise.exerciseType === "rhyme") {
      const selectedOption = exercise.options[result.userAnswer];
      const correctOption = exercise.options.find(opt => opt.isCorrect);
      
      return (
        <div className="text-sm">
          <div className="font-medium mb-2">{exercise.question}</div>
          <div className="mb-2">
            <span className="font-medium">Target word: </span>
            <span>{exercise.targetWord}</span>
          </div>
          <div className="mb-1">
            <span className="font-medium text-gray-600">Your answer: </span>
            <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
              {selectedOption ? selectedOption.word : "No answer"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Correct answer: </span>
            <span className="text-green-600">{correctOption.word}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  

  const formatClickToChangeAnswer = (exercise) => {
    if (exercise.type === "capitalize") {
      return exercise.words
        .filter(word => word.shouldCapitalize)
        .map(word => word.text.charAt(0).toUpperCase() + word.text.slice(1))
        .join(", ");
    } else if (exercise.type === "pronoun") {
      return exercise.words
        .filter(word => word.isPronoun)
        .map(word => word.correctForm)
        .join(", ");
    }
    return "";
  };

  const renderHighlightQuestionDetails = (result) => {
    return (
      <div className="text-sm">
        <div className="font-medium mb-2">{result.question}</div>
        <div className="mb-1">
          <span className="font-medium text-gray-600">Your answer: </span>
          <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
            {result.userAnswer || "No answer provided"}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-600">Correct answer: </span>
          <span className="text-green-600">{result.correctAnswer}</span>
        </div>
        {!result.isCorrect && (
          <div className="mt-2 text-xs text-gray-600 italic">
            {result.explanation}
          </div>
        )}
      </div>
    );
  };

  const renderSequencingDetails = (exercise, result) => {
    return (
      <div className="text-sm">
        <div className="font-medium mb-2">{exercise.question}</div>
        {exercise.contentType === "mixed" && exercise.image && (
          <div className="mb-4">
            <img
              src={exercise.image}
              alt="Exercise"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
        <div className="mb-2">
          <span className="font-medium text-gray-600">Your sequence: </span>
          <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
            {result.userAnswer.join(" → ")}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-600">Correct sequence: </span>
          <span className="text-green-600">{result.correctAnswer.join(" → ")}</span>
        </div>
        {!result.isCorrect && result.explanation && (
          <div className="mt-2 text-xs text-gray-600 italic">
            {result.explanation}
          </div>
        )}
      </div>
    );
  };

  const isImagePath = (str) => {
    return str.startsWith('/images/') || str.startsWith('http');
  };
  
  const renderContent = (content) => {
    if (isImagePath(content)) {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={content} 
            alt="Exercise item" 
            className="w-8 h-8 object-cover rounded"
          />
          <span className="text-sm">{content.split('/').pop()}</span>
        </div>
      );
    }
    return <span className="text-sm">{content}</span>;
  };
  
  const renderDragAndDropDetails = (exercise, result) => {
    const { categories = [] } = exercise;
    
    return (
      <div className="text-sm">
        <div className="font-medium mb-3">{exercise.question}</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User's Answers */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-bold text-gray-600 mb-2">Your Answer:</div>
            {categories.map((category) => (
              <div key={`user-${category}`} className="mb-3">
                <div className="font-bold text-gray-500 text-xs mb-1">
                  {category.toUpperCase()}:
                </div>
                <div className="pl-3 space-y-2">
                  {(result.userAnswer[category] || []).map((answer, index) => (
                    <div
                      key={`user-${category}-${index}`}
                      className={
                        (result.correctAnswer[category] || []).includes(answer)
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {renderContent(answer)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
  
          {/* Correct Answers */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-bold text-gray-600 mb-2">Correct Answer:</div>
            {categories.map((category) => (
              <div key={`correct-${category}`} className="mb-3">
                <div className="font-bold text-gray-500 text-xs mb-1">
                  {category.toUpperCase()}:
                </div>
                <div className="pl-3 space-y-2">
                  {(result.correctAnswer[category] || []).map((answer, index) => (
                    <div
                      key={`correct-${category}-${index}`}
                      className="text-green-600"
                    >
                      {renderContent(answer)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {!result.isCorrect && exercise.explanation && (
          <div className="mt-3 text-xs text-gray-600 italic">
            {exercise.explanation}
          </div>
        )}
      </div>
    );
  };
  
  const renderTableDetails = (exercise, result) => {
    return (
      <div className="text-sm">
        <div className="font-medium mb-2">{exercise.question}</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User's Answers */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-bold text-gray-600 mb-2">Your Answers:</div>
            <div className="space-y-2">
              {exercise.rows.map((row, index) => (
                <div key={`user-${index}`} className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500">{row.text}</div>
                  <div className={result.userAnswer[index] === row.correctAnswer ? 
                    "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {exercise.columns.find(col => col.id === result.userAnswer[index])?.label || "No answer"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answers */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-bold text-gray-600 mb-2">Correct Answers:</div>
            <div className="space-y-2">
              {exercise.rows.map((row, index) => (
                <div key={`correct-${index}`} className="flex flex-col gap-1">
                  <div className="text-xs text-gray-500">{row.text}</div>
                  <div className="text-green-600 font-medium">
                    {exercise.columns.find(col => col.id === row.correctAnswer)?.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!result.isCorrect && exercise.explanation && (
          <div className="mt-3 text-xs text-gray-600 italic">
            {exercise.explanation}
          </div>
        )}
      </div>
    );
  };
    const renderQuestionDetails = (exercise, result) => {
    if (exerciseType === "table") {
      return renderTableDetails(exercise, result);
    }
    else if (exerciseType === "sequencing") {
      return renderSequencingDetails(exercise, result);
    }
    else if (exerciseType === "gapFill") {
      return renderGapFillDetails(exercise, result);
    } 
    else if (result.exerciseType === "sound_matching" || result.exerciseType === "synonym") {
      return renderMultipleAnswerDetails(result);
    } 
    else if (exercise.exerciseType === "syllable" || exercise.exerciseType === "rhyme") {
      return renderSingleAnswerDetails(exercise, result);
    } 
    else if (exerciseType === "highlight") {
      return renderHighlightQuestionDetails(result);
    } 
    else if (exerciseType === "clickToChange") {
      const correctAnswer = formatClickToChangeAnswer(exercise);
      return (
        <>
          <div className="font-medium mb-2">{exercise.question}</div>
          <div className="text-sm">
            <div className="mb-1">
              <span className="font-medium text-gray-600">Your answer: </span>
              <span className={result.isCorrect ? "text-green-600" : "text-red-600"}>
                {result.userAnswer || "No answer provided"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Correct answer: </span>
              <span className="text-green-600">{correctAnswer}</span>
            </div>
            {!result.isCorrect && (
              <div className="mt-2 text-xs text-gray-600 italic">
                {exercise.explanation}
              </div>
            )}
          </div>
        </>
      );
    } 
    else if (exerciseType === "fillInTheBlanks") {
      return formatFillInTheBlanks(exercise, result.userAnswer);
    } 
    else if (exerciseType === "dragAndDrop") {
      return renderDragAndDropDetails(exercise, result);
    }
    return null;
  };

  

 return (
    <div className="max-w-2xl mx-auto p-3 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600">
          Quiz Results
        </h2>

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
                  {renderQuestionDetails(exercises[index], result, index)}
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {formatTime(results.times[index])}
                </span>
              </div>
            </div>
          ))}
        </div>

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
        userAnswer: PropTypes.arrayOf(PropTypes.string),
        correctAnswer: PropTypes.arrayOf(PropTypes.string),
        isCorrect: PropTypes.bool.isRequired,
        explanation: PropTypes.string,
      })
    ).isRequired,
    times: PropTypes.arrayOf(PropTypes.number).isRequired,
    correctAnswers: PropTypes.number.isRequired,
    wrongAnswers: PropTypes.number.isRequired,
    finalScore: PropTypes.number.isRequired,
  }).isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      contentType: PropTypes.string,
      image: PropTypes.string,
      type: PropTypes.string,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          correctAnswer: PropTypes.string.isRequired,
        })
      ),
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      correctOrder: PropTypes.arrayOf(PropTypes.string),
      solution: PropTypes.string,
    })
  ).isRequired,
  onRestart: PropTypes.func.isRequired,
  exerciseType: PropTypes.string.isRequired,
};


export default FinalResults;