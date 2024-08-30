import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoRoutePlanner from './pages/AutoRoutePlanner';
import AutoRouteResult from './pages/AutoRouteResult';
import Header from './components/LoginHeader';
import LoginModal from './components/LoginModal'; 
import LoginSuccess from './pages/LoginSuccess';
import { useState } from 'react';
import { UserProvider } from './contexts/UserContext'; 
import authService from './services/authService';

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false); 

  const handleLogout = () => {
    authService.logout();
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    console.log('Open Register Modal');
  };

  const handleHostModeClick = () => {
    console.log('Host Mode');
  };

  return (
    <UserProvider> {/* UserProvider로 앱을 감싸서 전역 상태 제공 */}
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
            <Route path="/auto-route-result" element={<AutoRouteResult />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
          </Routes>
          {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />} 
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
