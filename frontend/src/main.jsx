import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
{/* BrowserRouter (<BrowserRouter>): It provides the routing functionality for your React app. It listens to
 changes in the URL and updates the app without reloading the page. */}

    <BrowserRouter> 
    <App />
    </BrowserRouter>

  </StrictMode>,
)
