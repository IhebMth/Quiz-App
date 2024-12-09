import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/NavBar';
import DragAndDropWithExample from './components/dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanksWithExample from './components/fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFillWithExample from './components/gapFill/GapFillWithAnExample';
import HighlightWithExample from './components/highlight/HighlightWithAnExample';

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

          </Routes>
      </div>
    </Router>
  );
};

export default App;