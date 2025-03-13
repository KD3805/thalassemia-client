import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ThalassemiaDetection from './thalassemia/ThalassemiaDetection.jsx'

createRoot(document.getElementById('root')).render(
  <div>
    <ThalassemiaDetection />
  </div>
)
