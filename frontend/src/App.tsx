import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import ResetPassword from './page/ResetPassword';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to="/sign-in" replace />}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/sign-in' element={<SignIn/>}></Route>
            <Route path='/sign-up' element={<SignUp/>}></Route>
            <Route path='/reset-password' element={<ResetPassword/>}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
