import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CountryDetails from "./pages/countries"
import Weather from './pages/weather'
import Profile from './pages/profile'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weather" element={<Weather />} />
      <Route path='/country/:name' element= {<CountryDetails />}/>
      <Route path='/profile' element={<Profile/>} />
    </Routes>
      
    </BrowserRouter>
  )
}

export default App
