import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("checking...")

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      });
  }, []);

  return (
    <>
      <h1>PaletteMania</h1>
      <p>{status}</p>
    </>
  )
}

export default App
