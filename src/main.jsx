import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FortuneProvider } from './context/FortuneContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <FortuneProvider>
                <App />
            </FortuneProvider>
        </AuthProvider>
    </React.StrictMode>,
)
