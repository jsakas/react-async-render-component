import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStyle } from './index.style';
import { CssVarsProvider } from '@mui/joy/styles';
import { UserProvider } from './UserProvider';
import { AsyncRenderProvider } from './npm-module/AsyncRenderProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <CssVarsProvider>
      <UserProvider>
        <AsyncRenderProvider>
          <App />
        </AsyncRenderProvider>
      </UserProvider>
    </CssVarsProvider>
  </React.StrictMode>
);
