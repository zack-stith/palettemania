import { useState, useEffect } from 'react'
import './App.css'
import { apiRequest, getPalettes, login } from './api.js';

function App() {
  const [status, setStatus] = useState("checking...")

  return (
    <>
      <h1>PaletteMania</h1>
      <p>{status}</p>
    </>
  )
}

export default App
