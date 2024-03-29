import React, { useState } from "react";
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import Spinner from "../Spinner/Spinner";
import { useTelegram } from "../../hooks/useTelegram"; 
import {useCallback, useEffect} from "react";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Masonry from 'react-masonry-css';
import Button from "../Button/Button";
import { Link } from 'react-router-dom';


const breakpointColumnsObj = {
  default: 3, // Количество колонок по умолчанию
  1200: 3, // Количество колонок при ширине экрана 1200px и выше
  900: 3, // Количество колонок при ширине экрана 900px и выше
  600: 3 // Количество колонок при ширине экрана 600px и выше
};

const getTotalPrice = (items) =>{
    return items.reduce((acc, item)=>{
        return acc += item.price
    }, 0);
    
}

const ProductList = () =>{
    const [addedItems, setAddedItems ] = useState([]);
    const {tg, queryId} = useTelegram();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [laraSession, setLaraSession] = useState('');
    const [xsrfToken, setXsrfToken] = useState('');
    const [cookieStr, setCookieStr] = useState('');
    const [orderButtonLabel, setOrderButtonLabel] = useState('Оформить заказ');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const botUrl = process.env.REACT_APP_BOT_URL;

    useEffect(() => {
        console.log('getting goods');
        let cleanup = false;
        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch(botUrl+'/api/goods');
                const jsonData = await response.json();
                if (!cleanup) {
                    setProducts(jsonData.products);
                    setToken(jsonData.csrf_token);
                    setLaraSession(jsonData.lara_session);
                    setXsrfToken(jsonData.xsrf_token);                    
                    setCookieStr('XSRF-TOKEN='+jsonData.xsrf_token+'; laravel_session='+jsonData.lara_session);
                }
            } catch {

            } finally {
                setIsLoading(false);
            }
        })()
        console.log('222');
        return () => {
            cleanup = true
        }
    }, []);

    const onAdd = (product) => {        
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        // console.log("alreadyAdded", alreadyAdded);
        console.log("token", token);
        let newItems = [];

        let data = {};

        if (alreadyAdded) {
            
           data = {
                "product_id": product.id,
                "token": token,
                "action": "removePosition",
                "cookie_str": cookieStr
            };
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {

            data = {
                "product_id": product.id,
                "token": token,
                "action": "add",
                "cookie_str": cookieStr
            };

            console.log('else');
            newItems = [...addedItems, product];
        }

        fetch(botUrl+'/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                body: JSON.stringify(data),
                credentials: 'include'
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                console.log(response.status);
                // Additional response handling, if necessary
                console.log('Request successful');
            })
            .catch(error => {
                console.error('Error:', error);
            });

        setAddedItems(newItems);
        console.log(newItems);

        if (newItems.length === 0) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
            const goodsCount = newItems.length;
            console.log(`Оформить заказ (${goodsCount} тов. по цене: ${getTotalPrice(newItems)} тнг)`);
            setOrderButtonLabel(`Оформить заказ (${goodsCount} тов. по цене: ${getTotalPrice(newItems)} тнг)`);
           
        }
    };

    return (
        <div className="list">
        {isLoading ? (
            <Spinner />
          ) : (
            
                <Accordion allowZeroExpanded style={{"width":"100%"}}>
                    {products.reduce((sections, item) => {
                    const sectionIndex = sections.findIndex(
                        section => section.title === item.section_title
                    );
                    if (sectionIndex === -1) {
                        sections.push({
                        title: item.section_title,
                        items: [item]
                        });
                    } else {
                        sections[sectionIndex].items.push(item);
                    }
                    return sections;
                    }, []).map(section => (
                    <AccordionItem key={section.title}>
                        <AccordionItemHeading>
                            <AccordionItemButton>{section.title}</AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="masonry-grid"
                            columnClassName="masonry-grid-column"
                            >
                                {section.items.map(item => (
                                    <div key={item.id} className="section-item">
                                        <ProductItem
                                        product={item}
                                        onAdd={onAdd}
                                        className={'item'}
                                    />
                                    </div>
                                ))}
                            </Masonry>                  
                        </AccordionItemPanel>
                    </AccordionItem>
                    ))}
                    <br></br>
                    {isButtonDisabled ? <div>Выберите товары для заказа</div> : (<Link className={'button set-order'} 
                            to={`/order_detail/${cookieStr}?token=${token}`}
                            >
                            {orderButtonLabel}
                        </Link>)}                
                    
                </Accordion>

                        
                
        )}</div>
      );
}

export default ProductList;