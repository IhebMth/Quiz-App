import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import DragAndDropWithExample from './components/dragAndDrop/DragAndDropWithAnExample';
import './App.css';
import FillInTheBlanksWithExample from './components/fillInTheBlanks/FillInTheBlanksWithAnExample';

const App = () => {
  return (
    <Router>
      <div className=" sm:min-h-screen  sm:bg-gradient-to-br from-blue-500 via-blue-300 to-green-300">
        <Navbar />
          <Routes>
            <Route path="/drag-and-drop" element={<DragAndDropWithExample />} />
            <Route path="/fill-in-the-blanks" element={<FillInTheBlanksWithExample />} />

          </Routes>
      </div>
    </Router>
  );
};

export default App;