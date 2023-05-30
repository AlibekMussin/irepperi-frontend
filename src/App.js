import { useEffect } from 'react';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductsList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import FullScreenProduct from './components/FullScreenProduct/FullScreenProduct';
import OrderDetail from './components/OrderDetail/OrderDetail';

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
        <Route path={'order_detail/:cookieStr'} element={<OrderDetail />}/>
        <Route path={"/product/:productId"} element={<ProductDetail/>} />
      </Routes>
    </div>

  );
}

export default App;
