    import ExampleSectionSequencing from './ExampleSectionSequencing';
import Sequence from './Sequencing';
import exercisesData from './sequencingExercises.json'

const SequencingWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-full"> {/* Changed from w-auto to w-full */}
        <ExampleSectionSequencing data={exercisesData}>
          <Sequence />
        </ExampleSectionSequencing>
      </div>
    </div>
  );
};

export default SequencingWithExample;