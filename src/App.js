import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AutoRoutePlanner from './pages/AutoRoutePlanner';
import AutoRouteResult from './pages/AutoRouteResult';
import Favorites from './pages/Favorites';
import NoticeInquiryTab from './pages/NoticeInquiryTab';
import Header from './components/LoginHeader';
import LoginModal from './components/LoginModal'; 
import LoginSuccess from './pages/LoginSuccess';
import { useState } from 'react';
import { UserProvider } from './contexts/UserContext'; 
import authService from './services/authService';
import StoreDetail from './pages/StoreDetail';

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
    <UserProvider> 
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
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/notice-inquiry-tab" element={<NoticeInquiryTab />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
            <Route path="/store/:id" element={<StoreDetail />} />
          </Routes>
          {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />} 
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
