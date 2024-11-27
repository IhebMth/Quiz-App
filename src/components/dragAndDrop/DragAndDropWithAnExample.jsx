import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exerciseData from './data/dragAndDropExercises.json';

const DragAndDropWithExample = () => {
  return (
    <ExampleSectionDrag data={exerciseData}>
      <DragAndDrop />
    </ExampleSectionDrag>
  );
};

export default DragAndDropWithExample;