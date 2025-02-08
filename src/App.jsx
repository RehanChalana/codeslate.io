import Login from './auth/Login'
import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import LandingPage from './pages/LandingPage'


function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
    <div>
        <LandingPage />
    </div>
  )
}

export default App
