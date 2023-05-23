import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductsList/ProductList';
import FullScreenProduct from './components/FullScreenProduct/FullScreenProduct';

function App() {
  const {tg, onToggleButton} = useTelegram();

  useEffect(()=>{
    tg.ready();
  },[])

  
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route index element={<ProductList />}/>
        <Route path={'form'} element={<FullScreenProduct />}/>
      </Routes>
    </div>

  );
}

export default App;
