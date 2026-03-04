import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UploadProvider } from './shared/context/UploadContext';
import Navbar from './shared/components/Navbar';
import Home from './features/home/pages/home';
import Login from './features/auth/pages/login';
import Register from './features/auth/pages/register';

// Account Pages
import Account from './features/myAccount/pages/account';
import UploadsTab from './features/myAccount/components/UploadsTab';
import ReceivedFilesTab from './features/myAccount/components/ReceivedFilesTab';
import VideosTab from './features/myAccount/components/VideosTab';
import BackgroundsTab from './features/myAccount/components/BackgroundsTab';
import SubUsersTab from './features/myAccount/components/SubUsersTab';
import PasswordTab from './features/myAccount/components/PasswordTab';
import SettingsTab from './features/myAccount/components/SettingsTab';

// Info Pages
import Terms from './features/info/pages/Terms';
import About from './features/info/pages/About';
import Contact from './features/info/pages/Contact';

function App() {
  return (
    <UploadProvider>
      <div className="w-full min-h-screen relative font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/my-account" element={<Account />}>
            <Route index element={<Navigate to="uploads" replace />} />
            <Route path="uploads" element={<UploadsTab />} />
            <Route path="received" element={<ReceivedFilesTab />} />
            <Route path="videos" element={<VideosTab />} />
            <Route path="backgrounds" element={<BackgroundsTab />} />
            <Route path="sub-users" element={<SubUsersTab />} />
            <Route path="password" element={<PasswordTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Route>

          {/* Info Pages Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </UploadProvider>
  );
}

export default App;
