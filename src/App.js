import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Chat from './pages/chat/Chat';
import Setavtar from './pages/avtar/Setavtar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/avtar' element={<Setavtar/>} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
