import React, { useState, useEffect } from "react";
import './OrderDetail.css';
import Spinner from "../Spinner/Spinner";
import { useParams, useHistory  } from 'react-router-dom';
import { useTelegram } from "../../hooks/useTelegram"; 


const OrderDetail = () => {
    const {cookieStr } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const {tg, user} = useTelegram();
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
      };
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    useEffect(() => {
        console.log('555');
        console.log('cookieStr', cookieStr);
        let cleanup = false;
        const cookieStrM = cookieStr.replace('%20',' ');

        // console.log('cookieStrM', cookieStrM);
        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://shiba.kz/api/order',{
                    headers:{
                        'Cookies': cookieStr
                    },
                    credentials: 'include'
                });
                console.log(response);
                const jsonData = await response.json();
                console.log(jsonData);
                if (!cleanup) {
                    setOrder(jsonData);
                    setProducts(jsonData.goods);
                    setTotal(jsonData.total);
                }
            } catch {

            } finally {
                setIsLoading(false);
            }
        })()
        console.log('666');
        return () => {
            cleanup = true
        }
    }, []);

    return (
        <div className="order-detail">
            <h2>Оформление заказа</h2><br></br>
            <table className="order-table">
                <thead>
                <tr>
                    <th></th>
                    <th>Наименование</th>
                    <th>Цена</th>
                    <th>Количество</th>
                </tr>
                </thead>
                <tbody>
                {products.map(item => (
                    <tr key={item.product_id}>
                    <td><img style={{height:'70px'}} src={item.product_img} alt="Product" /></td>
                    <td>{item.product_name}</td>
                    <td>{item.price}</td>
                    <td>{item.products_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                
                <input className="input" type="text" value={user?.last_name} onChange={handleLastNameChange} placeholder="Фамилия"/></div>
            <div><input className="input" type="text" value={user?.first_name} onChange={handleFirstNameChange} placeholder="Имя" /></div>
            <div><input className="input" type="text" value={phoneNumber} onChange={handlePhoneNumberChange}  placeholder="Номер телефона"/></div>
            
        </div>
    );
}
export default OrderDetail;