import ExampleSectionGapFill from './ExampleSectionGapFill';
import GapFill from './GapFill';
import exercisesData from './gapFillExercises.json';

const GapFillWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionGapFill data={exercisesData}>
          <GapFill />
        </ExampleSectionGapFill>
      </div>
    </div>
  );
};

export default GapFillWithExample;
