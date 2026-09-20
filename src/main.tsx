import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackTitle="Application Initializing"
      fallbackMessage="Greendot Bank is refreshing session parameters. Click Try Again or Reload Page to continue."
      onReset={() => {
        try {
          window.localStorage.removeItem('greendot_bank_state_v1');
        } catch {}
        window.location.reload();
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
