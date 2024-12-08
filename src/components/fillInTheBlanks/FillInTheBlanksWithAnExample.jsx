// FillInTheBlanksWithExample.jsx
import ExampleSectionFill from './ExampleSectionFill';
import FillInTheBlanks from './FillInTheBlanks';
import exercisesData from './fillnTheBlanksExercises.json'

const FillInTheBlanksWithExample = () => {
  return (
    <div className=" bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto  ">
        <ExampleSectionFill data={exercisesData}>
          <FillInTheBlanks />
        </ExampleSectionFill>
      </div>
    </div>
  );
};

export default FillInTheBlanksWithExample;