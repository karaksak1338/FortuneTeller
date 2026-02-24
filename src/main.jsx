import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FortuneProvider } from './context/FortuneContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <FortuneProvider>
            <App />
        </FortuneProvider>
    </React.StrictMode>,
)
