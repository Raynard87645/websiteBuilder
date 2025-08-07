import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import socketService from '@/services/socket';

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ChatPage from '@/pages/ChatPage';
import LoadingPage from '@/pages/LoadingPage';

// Protected Route Component
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const { clearStore } = useChatStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, []);

  useEffect(() => {
    // Connect to socket when authenticated
    if (isAuthenticated && user) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        socketService.connect(token);
      }
    } else {
      // Disconnect socket and clear chat store when not authenticated
      socketService.disconnect();
      clearStore();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user, clearStore]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterPage />
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/chat/*" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
          } 
        />

        {/* 404 fallback */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;