import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from './context/SearchContext.jsx';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <StrictMode>
    <SearchProvider>
        <App />
    </SearchProvider>
  </StrictMode>
  </GoogleOAuthProvider>

)
