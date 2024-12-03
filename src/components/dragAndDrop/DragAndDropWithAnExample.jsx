import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exerciseData from './data/dragAndDropExercises.json';

const DragAndDropWithExample = () => {
  return (
    <div className="bg-white  lg:mx-48">
      <div className="w-auto pt-10">
        <ExampleSectionDrag data={exerciseData}>
          <DragAndDrop />
        </ExampleSectionDrag>
      </div>
    </div>
  );
};

export default DragAndDropWithExample;