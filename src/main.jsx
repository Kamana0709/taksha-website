/**
 * Main entry point — Taksha Nexus Digital Craft Studio
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeProvider';
import { MotionPreferenceProvider } from './context/MotionPreferenceContext';
import { router } from './router';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';

// Global styles — order matters
import './styles/tokens.css';
import './styles/reset.css';
import './styles/typography.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <ThemeProvider>
            <MotionPreferenceProvider>
              <RouterProvider router={router} />
            </MotionPreferenceProvider>
          </ThemeProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
