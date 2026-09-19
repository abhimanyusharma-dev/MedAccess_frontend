import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { PatientDataProvider } from './context/PatientDataContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import IntroScreen from './components/intro/IntroScreen';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <PatientDataProvider>
          <SidebarProvider>
            <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0B1728',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '14px',
                fontFamily: 'Outfit, sans-serif'
              }
            }}
          />
          </SidebarProvider>
        </PatientDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
