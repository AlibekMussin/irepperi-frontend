import React, { useState, useEffect } from "react";
import './OrderDetail.css';
import Spinner from "../Spinner/Spinner";
import { useParams, useHistory  } from 'react-router-dom';

const OrderDetail = () => {
    const { cookieStr } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        console.log('555');
        console.log(cookieStr);
        let cleanup = false;
        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://shiba.kz/api/order',{
                    headers:{
                        'Cookie': cookieStr
                    }
                });
                const jsonData = await response.json();
                console.log(jsonData);
                if (!cleanup) {
                    setOrder(jsonData);
                    setProducts(jsonData.goods);
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
            1111
        </div>
    );
}
export default OrderDetail;