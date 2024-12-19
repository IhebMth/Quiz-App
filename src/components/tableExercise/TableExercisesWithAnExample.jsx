import ExampleTableSection from './ExampleTableSection';
import Table from './TableExercise';
import exercisesData from './tableExercises.json';

const TableWithExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleTableSection data={exercisesData}>
          <Table />
        </ExampleTableSection>
      </div>
    </div>
  );
};

export default TableWithExample;