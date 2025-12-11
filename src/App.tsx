import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='sign-in' element={<SignIn/>}></Route>
            <Route path='sign-up' element={<SignUp/>}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
