import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { BlueprintGridProvider } from './context/BlueprintGridContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <BlueprintGridProvider>
          <App />
        </BlueprintGridProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
