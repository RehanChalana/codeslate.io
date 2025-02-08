import Login from './auth/Login'
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
  )
}

export default App
