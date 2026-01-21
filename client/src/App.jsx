import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import FormBuilder from './Components/Form-Builder/FormBuilder'



function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/form-builder" element={<FormBuilder />} />
      </Routes>
    </div>
  )
}

export default App
