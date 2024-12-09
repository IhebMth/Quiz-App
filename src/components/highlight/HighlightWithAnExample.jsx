import ExampleSectionHighlight from './HighlightExampleSection';
import Highlight from './Highlight';
import exercisesData from './highlightExercises.json';

const HighlightWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionHighlight data={exercisesData}>
          <Highlight />
        </ExampleSectionHighlight>
      </div>
    </div>
  );
};

export default HighlightWithExample;