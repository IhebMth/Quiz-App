import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar';
import DragAndDropWithExample from './components/dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanksWithExample from './components/fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFillWithExample from './components/gapFill/GapFillWithAnExample';
import HighlightWithExample from './components/highlight/HighlightWithAnExample';
import ClickToChangeWithExample from './components/clickToChange/ClickToChangeWithAnExample';
import SingleAnswerWithExample from './components/singleAnswer/SingleAnswerWithAnExample';
import MultipleAnswerWithExample from './components/multipleAnswers/MultipleAnswersWithAnExample';
import SequencingWithExample from './components/sequencing/SequincingWithAnExample';
const App = () => {
  return (
    <Router>
      <div className=" sm:min-h-screen  sm:bg-gradient-to-br from-blue-500 via-blue-300 to-green-300">
        <Navbar />
          <Routes>
            <Route path="/drag-and-drop" element={<DragAndDropWithExample />} />
            <Route path="/fill-in-the-blanks" element={<FillInTheBlanksWithExample />} />
            <Route path="/gap-fill" element={<GapFillWithExample />} />
            <Route path="/highlight" element={<HighlightWithExample />} />
            <Route path="/click-to-change" element={<ClickToChangeWithExample />} />
            <Route path="/single-answer" element={<SingleAnswerWithExample />} />
            <Route path="/multiple-answers" element={<MultipleAnswerWithExample />} />
            <Route path="/sequencing" element={<SequencingWithExample />} />

          </Routes>
      </div>
    </Router>
  );
};

export default App;