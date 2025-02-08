import Login from './auth/Login'
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'


function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
