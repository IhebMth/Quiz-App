import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import DragAndDropWithExample from './components/dragAndDrop/DragAndDropWithAnExample';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 to-green-300">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/drag-and-drop" element={<DragAndDropWithExample />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;