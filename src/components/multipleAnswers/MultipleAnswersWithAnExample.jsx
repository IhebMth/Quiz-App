import ExampleSectionMultipleAnswer from './ExampleSectionMultipleAnswer';
import MultipleAnswer from './MultipleAnswers';
import exercisesData from './multipleAnswersExercises.json';

const MultipleAnswerWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionMultipleAnswer data={exercisesData}>
          <MultipleAnswer />
        </ExampleSectionMultipleAnswer>
      </div>
    </div>
  );
};

export default MultipleAnswerWithExample;