import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Landing from './component/Landing';
import Chat from './component/Chat';
import Ticket from './component/Ticket';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}></Route>
        <Route path='/chat' element={<Chat/>}></Route>
        <Route path='/ticket' element={<Ticket/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
