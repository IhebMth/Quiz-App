import ExampleSectionSingleAnswer from './ExampleSectionSingleAnswer';
import SingleAnswer from './SingleAnswer';
import exercisesData from './singleAnswerExercises.json';

const SingleAnswerWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionSingleAnswer data={exercisesData}>
          <SingleAnswer />
        </ExampleSectionSingleAnswer>
      </div>
    </div>
  );
};

export default SingleAnswerWithExample;