import React, { useState, useEffect } from "react";
import './OrderDetail.css';
import Spinner from "../Spinner/Spinner";
import { useParams, useHistory, useLocation   } from 'react-router-dom';
import { useTelegram } from "../../hooks/useTelegram"; 
import InputMask from 'react-input-mask';

const OrderDetail = () => {
    const location = useLocation();
    
    const {cookieStr } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [newTotal, setNewTotal] = useState(0);
    const [totalFirst, setTotalFirst] = useState(0);    
    const [delivery, setDelivery] = useState(0);
    const {tg, user, queryId} = useTelegram();
    const [lastName, setLastName] = useState(user?.last_name);
    const [firstName, setFirstName] = useState(user?.first_name);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedDeliveryOption, setDeliverySelectedOption] = useState('');
    const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
    const [showShowRoomAddress, setShowShowRoomAddress] = useState(false);
    const [city, setCity] = useState('Астана');
    const [cityValue, setCityValue] = useState('Астана');
    const [streetName, setStreetName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [idEmpotencyKey, setIdEmpotencyKey] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [isDeliveryNeed, setIsDeliveryNeed] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    // console.log('token', token);

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        checkFormValidity();
      };
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        checkFormValidity();
    };
    const handlePhoneNumberChange = (event) => {

        const inputPhoneNumber = event.target.value;
        // Удаляем все символы, кроме цифр
        const numericPhoneNumber = inputPhoneNumber.replace(/\D/g, '');
        // Форматируем номер телефона
        const formattedPhoneNumber = formatPhoneNumber(numericPhoneNumber);

        setPhoneNumber(formattedPhoneNumber);
        checkFormValidity();
    };

    const formatPhoneNumber = (phoneNumber) => {
        // Форматируем номер телефона в виде "+7 (705) 456-75-54"
        const formattedNumber = phoneNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
    
        return formattedNumber;
      };

    const checkFormValidity = () => {
        setIsFormValid(lastName !== '' && firstName !== '' && phoneNumber !== '');
      };

    const handleDeliveryOptionChange = (event) => {
        setDeliverySelectedOption(event.target.value);
        setShowAdditionalInputs(event.target.value === 'courier' || event.target.value === 'kazpost');
        setShowShowRoomAddress(event.target.value === 'self');
        setCityValue('Астана'); // Reset the value for other options
        setNewTotal(total);
        setIsDeliveryNeed(true);

        console.log(event.target.value);

        if (event.target.value === 'self') {
            setNewTotal(total - 1500);
            setIsDeliveryNeed(false);
          }
          else {
            if (total<25000)
            {
                setNewTotal(total);
                setIsDeliveryNeed(true);
            }
            else 
            {
                setNewTotal(total - 1500);
                setIsDeliveryNeed(true);
            }
                
          }
          console.log('total', total);
          console.log('newTotal', newTotal);
    };

    const handleCityChange = (event) => {
        setCityValue(event.target.value);
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
                    setTotalFirst(jsonData.total_first);
                    setDelivery(jsonData.delivery)
                    setIdEmpotencyKey(jsonData.idempotency_key);
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

    useEffect(() => {
        setNewTotal(total);
        setIsDeliveryNeed(delivery>0);
        console.log('total', total);
        console.log('newTotal', newTotal);
    }, [total]);

    const handleSubmit = () => {
        setIsSubmitLoading(true);
        const data = {
          lastName: lastName,
          firstName: firstName,
          phoneNumber: phoneNumber,
          deliveryMethod: selectedDeliveryOption,
          city: cityValue,
          streetName: streetName,
          houseNumber: houseNumber,
          apartmentNumber: apartmentNumber,
          token: token,
          idEmpotencyKey: idEmpotencyKey,
        };        
    
        fetch('https://shiba.kz/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookies': cookieStr
          },
          credentials: 'include',
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
        }).then((tnxJson) => {                
                console.log('tnxJson', tnxJson);

                let deliveryForSend = delivery;
                if (!isDeliveryNeed)
                {
                    deliveryForSend = 0;
                }

                const data_for_bot = {
                    title: tnxJson.title,
                    text: tnxJson.text,
                    number: tnxJson.number,
                    payment: tnxJson.payment,
                    products: products,
                    total: newTotal,
                    delivery: deliveryForSend,
                    queryId,
                    token
                };
                console.log('data_for_bot', data_for_bot);
                
                fetch('https://wolf.shiba.kz/web-data', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data_for_bot)
                  })
                    .then(response_bot => {
                      if (!response_bot.ok) {
                        throw new Error('Request failed');
                      }
                      // Additional response handling, if necessary
                      console.log('Request successful');
                    })
                    .catch(error_bot => {
                      console.error('Error:', error_bot);
                    });
                setIsLoading(false);
                setIsSubmitLoading(false);     
            })
            .catch((error) => {
            // Обработка ошибок
            console.error(error);
            setIsSubmitLoading(false);
          });
      };


    return (
        <div className="order-detail">
            <h2>Оформление заказа</h2><br></br>
            {isLoading ? (
            <Spinner />
          ) : (<div>
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
                <tfoot>
                    <tr>
                        <th colSpan={2}>Сумма</th>
                        <td>{totalFirst>0 ? <div>{totalFirst}</div> : <div>0</div>} </td>
                        <td></td>
                    </tr>                
                    {isDeliveryNeed ? <tr>
                        <th colSpan={2}>Доставка{delivery>0 ? <div style={{fontWeight:'normal'}}><br></br>
                        <em>*Если сумма заказа превысит 25000 ₸,<br></br> то доставка курьером/ Казпочтой<br></br> будет бесплатной.</em></div>: <div></div>}</th>
                        <td>{delivery>0 ? <div>{delivery}
                        </div> : <div>Бесплатно</div>} </td>
                        <td></td>
                    </tr> : <></>}
                    <tr>
                        <th colSpan={2}>К оплате</th>
                        <td>{newTotal}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            <div className="inputs-form">
                <h4>Данные получателя</h4>
                <div>
                    <label htmlFor="last_name">Фамилия <strong style={{color:'red'}}>*</strong></label><br></br>
                    <input required className="input" id={'last_name'} type="text" value={lastName} onChange={handleLastNameChange} placeholder="Фамилия"/>
                </div>
                <div>
                    <label htmlFor="first_name">Имя <strong style={{color:'red'}}>*</strong></label><br></br>
                    <input required className="input" id={'first_name'} type="text" value={firstName} onChange={handleFirstNameChange} placeholder="Имя" />
                </div>
                <div>
                    <label htmlFor="phone_number">Номер телефона (контактный) <strong style={{color:'red'}}>*</strong></label><br></br>
                    
                    <InputMask
                    className="input"
                    id="phone_number"
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    mask="+7 (999) 999-99-99"
                    placeholder="+7 (705) 456-75-54"
                    required
                    />
                </div>

                <div className="delivery-inputs">
                    <h4>Доставка</h4>
                    <div className="radio-inputs">
                        <label>
                            <input name="deliveryMethod" type="radio" value="courier" checked={selectedDeliveryOption === 'courier'} onChange={handleDeliveryOptionChange} />Курьером</label>
                        <br></br>
                        <label>
                            <input name="deliveryMethod" type="radio" value="self" checked={selectedDeliveryOption === 'self'} onChange={handleDeliveryOptionChange}/>Самовывоз</label>
                        <br></br>

                        <label>
                            <input name="deliveryMethod" type="radio" value="kazpost" checked={selectedDeliveryOption === 'kazpost'} onChange={handleDeliveryOptionChange}/>Казпочтой/ СДЭК/ Рикой/ др.</label>
                    </div>

                    {showAdditionalInputs && (
                        <div className="additional-inputs">
                            <label>
                                Город:<br></br>
                                <input 
                                className={'input'}
                                type="text" 
                                name="city" 
                                value={cityValue} onChange={handleCityChange}
                                disabled={selectedDeliveryOption === 'courier'} 
                                 />
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
                    
                    {isSubmitLoading ? (<Spinner />) : (
                    <button  disabled={!isFormValid} className="button" onClick={handleSubmit}>Подтвердить заказ</button>)}
                </div>
            </div>
            </div>)}
            
        </div>
    );
}
export default OrderDetail;