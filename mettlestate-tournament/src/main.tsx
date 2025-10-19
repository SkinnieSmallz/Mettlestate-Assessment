import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RegistrationProvider } from '../src/context/RegistrationContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </React.StrictMode>,
)