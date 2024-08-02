import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/Home';
import AutoRoutePlanner from './pages/AutoRoutePlanner';
import Header from './components/LoginHeader';

function App() {
  const handleLogout = () => {
    console.log('Logout');
  };

  const openLoginModal = () => {
    console.log('Open Login Modal');
  };

  const openRegisterModal = () => {
    console.log('Open Register Modal');
  };

  const handleHostModeClick = () => {
    console.log('Host Mode');
  };

  return (
    <Router>
      <div className="App">
        <Header 
          handleLogout={handleLogout}
          openLoginModal={openLoginModal}
          openRegisterModal={openRegisterModal}
          handleHostModeClick={handleHostModeClick}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auto-route-planner" element={<AutoRoutePlanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
