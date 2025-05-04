import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Summarize from './Pages/Summarize'
import Navbar from './components/Navbar'
import Merge from './Pages/Merge'
import Convert from './Pages/Convert'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summarize" element={<Summarize />} />
            <Route path="/merge" element={<Merge></Merge>} />
            <Route path="/convert" element={<Convert></Convert>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
