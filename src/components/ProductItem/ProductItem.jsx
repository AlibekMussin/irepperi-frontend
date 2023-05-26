import React, { useState } from "react";
import Button from "../Button/Button";
import './ProductItem.css';
import FullScreenProduct from '../FullScreenProduct/FullScreenProduct';
import ProductDetail from '../ProductDetail/ProductDetail';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCartPlus } from '@fortawesome/free-solid-svg-icons';

const ProductItem = ({product, className, onAdd}) => {
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const openFullScreen = () => {
        setIsFullScreen(true);
      };
    
    const closeFullScreen = () => {
        setIsFullScreen(false);
      };

    const onAddHandler = () => {
        if (isButtonPressed == false)
            setIsButtonPressed(true);
        else
            setIsButtonPressed(false);

        onAdd(product);
    }

    const buttonText = isButtonPressed ? 'Добавлено' : 'В корзину';
    const buttonClassName = isButtonPressed ? 'add-btn pressed' : 'add-btn';

    return (
        <div className={'product ' + className}>
            <img className={'img'} src={product.image}  onClick={openFullScreen}/>
            {isFullScreen && (
            <FullScreenProduct imageUrl={product.image} onClose={closeFullScreen} />
            )}
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.price}</b></span>
            </div>
            
            <div className="buttons_div">
                <Link className={'link'} to={`/product/${product.id}`} product={product.id}>
                    <FontAwesomeIcon icon={faEye} />
                </Link>
                <Button className={buttonClassName} onClick={onAddHandler}>
                    <FontAwesomeIcon icon={faCartPlus} />
                </Button>
            </div>
        </div>
    );
};

export default ProductItem;