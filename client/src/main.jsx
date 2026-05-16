import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from './context/SearchContext.jsx';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="641407208093-3pjp0eat2p8k8a2remdhdfnd9tsth9vs.apps.googleusercontent.com">
  <StrictMode>
    <SearchProvider>
        <App />
    </SearchProvider>
  </StrictMode>
  </GoogleOAuthProvider>

)
