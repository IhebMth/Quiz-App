import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exerciseData from './data/dragAndDropExercises.json';

const DragAndDropWithExample = () => {
  return (
    <div className="lg:flex lg:flex-col lg:space-y-4">
      {/* Only show on 320px width and hide it between 768px - 640px using inline CSS */}
      <div style={{ display: 'none' }} className="example-section">
        <ExampleSectionDrag data={exerciseData} />
      </div>

      {/* DragAndDrop component stays as it is */}
      <div className="lg:w-full">
        <DragAndDrop />
      </div>

      <style>
        {`
          /* Show the ExampleSectionDrag only below 640px and above 768px */
          @media (max-width: 640px) {
            .example-section {
              display: block !important;
            }
          }

          /* Hide the ExampleSectionDrag between 768px and 640px */
          @media (min-width: 640px) and (max-width: 768px) {
            .example-section {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DragAndDropWithExample;
