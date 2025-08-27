
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ChatPage from './pages/ChatPage';
import GalleryPage from './pages/GalleryPage';
import AccountPage from './pages/AccountPage';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col h-screen bg-brand-primary">
          <Header />
          <main className="flex-grow overflow-hidden">
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;