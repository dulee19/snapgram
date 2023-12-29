import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import AuthProvider from './context/AuthContext.tsx'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </Router>
  </React.StrictMode>,
)
