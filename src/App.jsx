import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import DragAndDropWithExample from './components/dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanksWithExample from './components/fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFillWithExample from './components/gapFill/GapFillWithAnExample';
import HighlightWithExample from './components/highlight/HighlightWithAnExample';
import ClickToChangeWithExample from './components/clickToChange/ClickToChangeWithAnExample';
import SingleAnswerWithExample from './components/singleAnswer/SingleAnswerWithAnExample';
import MultipleAnswerWithExample from './components/multipleAnswers/MultipleAnswersWithAnExample';
import SequencingWithExample from './components/sequencing/SequincingWithAnExample';
import TableExercisesWithAnExample from './components/tableExercise/TableExercisesWithAnExample';
import ExerciseManager from './components/Dashboard';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Contact from './components/Contact';
import About from './components/About';
import HomePage from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/drag-and-drop" element={<DragAndDropWithExample />} />
          <Route path="/fill-in-the-blanks" element={<FillInTheBlanksWithExample />} />
          <Route path="/gap-fill" element={<GapFillWithExample />} />
          <Route path="/highlight" element={<HighlightWithExample />} />
          <Route path="/click-to-change" element={<ClickToChangeWithExample />} />
          <Route path="/single-answer" element={<SingleAnswerWithExample />} />
          <Route path="/multiple-answers" element={<MultipleAnswerWithExample />} />
          <Route path="/sequencing" element={<SequencingWithExample />} />
          <Route path="/organize-information-by-topic" element={<TableExercisesWithAnExample />} />
          <Route path="/dashboard" element={<ExerciseManager />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;