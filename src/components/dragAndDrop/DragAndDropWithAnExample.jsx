import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exerciseData from './data/dragAndDropExercises.json';

const DragAndDropWithExample = () => {
  return (
    <>
      {/* Only show on 320px width and hide it between 768px - 640px using inline CSS */}
      

      {/* DragAndDrop component stays as it is */}
      <div className="bg-white sm:mx-10">
      <div className='w-auto pt-10  '>
        <ExampleSectionDrag data={exerciseData} />
      </div>
        <DragAndDrop />
      </div>
      </>
     
  );
};

export default DragAndDropWithExample;
