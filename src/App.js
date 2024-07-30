import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import AutoRoutePlanner from './pages/AutoRoutePlanner'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auto-route-planner" element={<AutoRoutePlanner />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
