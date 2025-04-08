import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
};

export default App; 