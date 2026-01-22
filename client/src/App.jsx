import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import FormBuilder from './Components/Form-Builder/FormBuilder'
import Home from './Pages/Home/Home.jsx'
import Response from './Pages/Response/Response.jsx'
import Login from './Authentication/Login-Page/Login.jsx'
import Register from './Authentication/Register-Page/Register.jsx'
import ProtectedRoute from './Authentication/Protect-Route/ProtectRoute.jsx'



function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route  element={<ProtectedRoute />} > 
          <Route path="/" element={<Home />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/forms/:id" element={<FormBuilder />} />
          <Route path="/response/:id" element={<Response />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
