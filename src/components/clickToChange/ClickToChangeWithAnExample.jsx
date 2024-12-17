import ExampleSectionClickToChange from './ExampleSectionClickToChange';
import ClickToChange from './ClickToChange';
import exercisesData from './ClickToChangeExercises.json';

const ClickToChangeWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionClickToChange data={exercisesData}>
          <ClickToChange />
        </ExampleSectionClickToChange>
      </div>
    </div>
  );
};

export default ClickToChangeWithExample;