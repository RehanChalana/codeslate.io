import Login from './auth/Login'
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import SignUp from './auth/SignUp';
import SlateSelection from './slate/SlateSelection';
import Slate from './slate/Slate';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} /> 
      <Route path="/home" element={<SlateSelection />} />
      <Route path="/room/:roomId" element={<Slate />} />
    </Routes>
  )
}

export default App