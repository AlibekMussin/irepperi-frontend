import { useEffect } from 'react';
import './App.css';
const tg = window.Telegram.WebApp;

function App() {
  useEffect(()=>{
    tg.ready();

  },[])

  const onClose = () =>{
    tg.close();
  }
  return (
    <div className="App">
      1111
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default App;
