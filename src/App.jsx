import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useContext } from 'react';

// Pages
import HomePage from './pages/HomePage';
import RoutePlanner from './pages/RoutePlanner';
import AutoRouteResult from './pages/AutoRouteResult';
import Favorites from './pages/Favorites';
import NoticeInquiryTab from './pages/NoticeInquiryTab';
import LoginSuccess from './pages/LoginSuccess';
import StoreDetail from './pages/StoreDetail';
import StoreSearch from './pages/StoreSearch'
import Mypage from './pages/Mypage';
import MyReview from './pages/MyReview';
import Login from './pages/Login';
import AccountDeletion from './pages/AccountDeletion';

// Components
import Header from './components/LoginHeader';
import BottomNavigation from './components/BottomNavigation';

// Context and Services
import { UserProvider, UserContext } from './contexts/UserContext';
import authService from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userProfile, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 메시지 표시
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
  };

  const handleAccountDeletion = () => {
    authService.accountDeletion();
  };

  return (
    <UserProvider>
      <Router>
        <AppContent
          handleLogout={handleLogout}
          handleAccountDeletion={handleAccountDeletion}
        />
      </Router>
    </UserProvider>
  );
}

function AppContent({ handleLogout, handleAccountDeletion }) {
  const location = useLocation();

  return (
    <DynamicAppContainer path={location.pathname}>
      <div className="App">
        <Header/>
        
        <DynamicMainContent path={location.pathname}>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/route-planner" element={
              <ProtectedRoute>
                <RoutePlanner />
              </ProtectedRoute>
            } />
            <Route path="/store-search" element={
              <ProtectedRoute>
                <StoreSearch />
              </ProtectedRoute>
            } />
            <Route path="/auto-route-result" element={
              <ProtectedRoute>
                <AutoRouteResult />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/notice-inquiry-tab" element={
              <ProtectedRoute>
                <NoticeInquiryTab />
              </ProtectedRoute>
            } />
            <Route path="/loginSuccess" element={
                <LoginSuccess />
            } />
            <Route path="/store/:id" element={
              <ProtectedRoute>
                <StoreDetail />
              </ProtectedRoute>
            } />
            <Route path="/mypage" element={
              <ProtectedRoute>
                <Mypage handleLogout={handleLogout} />
              </ProtectedRoute>
            } />
            <Route path="/my-review" element={
              <ProtectedRoute>
                <MyReview />
              </ProtectedRoute>
            } />
            <Route path="/account-deletion" element={
              <ProtectedRoute>
                <AccountDeletion handleAccountDeletion={handleAccountDeletion} />
              </ProtectedRoute>
            } />
          </Routes>
        </DynamicMainContent>
        
        {/* BottomNavigation은 로그인 페이지와 auto-route-result 페이지에서는 보이지 않게 처리 */}
        {location.pathname !== '/auto-route-result' && 
         <BottomNavigation />}
        
      </div>
    </DynamicAppContainer>
  );
}

const DynamicAppContainer = styled.div`
  max-width: ${(props) => props.path === '/auto-route-result' ? '5000px' : '600px'};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
  border-radius: 15px;
`;

const DynamicMainContent = styled.div`
  ${(props) =>
    props.path !== '/auto-route-result'
      ? `
        height: calc(100vh - 115px);
        overflow-y: auto;
      `
      : ''}
`;

export default App;