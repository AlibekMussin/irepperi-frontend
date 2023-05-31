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
    const [selectedDeliveryOption, setDeliverySelectedOption] = useState('');
    const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
    const [showShowRoomAddress, setShowShowRoomAddress] = useState(false);
    const [city, setCity] = useState('Астана');
    const [streetName, setStreetName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');


    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
      };
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleDeliveryOptionChange = (event) => {
        setDeliverySelectedOption(event.target.value);
        setShowAdditionalInputs(event.target.value === 'courier' || event.target.value === 'kazpost');
        setShowShowRoomAddress(event.target.value === 'pickup');
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };
    const handleStreetNameChange = (event) => {
        setStreetName(event.target.value);
    };
    const handleHouseNumberChange = (event) => {
        setHouseNumber(event.target.value);
    };
    const handleApartmentNumberChange = (event) => {
        setApartmentNumber(event.target.value);
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
            <div className="inputs_form">
                <h4>Данные получателя</h4>
                <div>
                    <label htmlFor="last_name">Фамилия</label><br></br>
                    <input className="input" id={'last_name'} type="text" value={user?.last_name} onChange={handleLastNameChange} placeholder="Фамилия"/>
                </div>
                <div>
                    <label htmlFor="first_name">Имя</label><br></br>
                    <input className="input" id={'first_name'} type="text" value={user?.first_name} onChange={handleFirstNameChange} placeholder="Имя" />
                </div>
                <div>
                    <label htmlFor="phone_nubmer">Номер телефона (контактный)</label><br></br>
                    <input className="input" id={'phone_nubmer'} type="text" value={phoneNumber} onChange={handlePhoneNumberChange}  placeholder="Номер телефона"/>
                </div>

                <div>
                    <h4>Доставка</h4>
                    <div className="radio-inputs">
                        <label>
                            <input type="radio" value="courier" checked={selectedDeliveryOption === 'courier'} onChange={handleDeliveryOptionChange} />Курьером</label>
                        <br></br>
                        <label>
                            <input type="radio" value="pickup" checked={selectedDeliveryOption === 'pickup'} onChange={handleDeliveryOptionChange}/>Самовывоз</label>
                        <br></br>

                        <label>
                            <input type="radio" value="kazpost" checked={selectedDeliveryOption === 'kazpost'} onChange={handleDeliveryOptionChange}/>Казпочтой</label>
                    </div>

                    {showAdditionalInputs && (
                        <div className="additional-inputs">
                            <label>
                                Город:<br></br>
                                <input className={'input'} type="text" name="city" value={city} onChange={handleCityChange} />
                            </label><br></br>

                            <label>
                                Улица:<br></br>
                                <input className={'input'} type="text" name="street" value={streetName}  onChange={handleStreetNameChange} />
                            </label><br></br>
                            <table>
                                <tr>
                                    <td>Номер дома:</td>
                                    <td>Номер квартиры:</td>
                                </tr>
                                <tr>
                                    <td><input className={'input input-mini'} type="text" name="houseNumber" value={houseNumber} onChange={handleHouseNumberChange} /></td>
                                    <td><input className={'input input-mini'} type="text" name="apartmentNumber" value={apartmentNumber} onChange={handleApartmentNumberChange} /></td>
                                </tr>
                            </table>
                        </div>
                    )}
                    {showShowRoomAddress && (
                        <div>
                            Самовывоз из: <strong>Астана, ул. Туркестан 16. 3 этаж, 3005 Шоурум CLOVER</strong>
                        </div>
                    )}

                </div>
            </div>
            
        </div>
    );
}
export default OrderDetail;