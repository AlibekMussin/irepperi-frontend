import React, { useState } from "react";
import Button from "../Button/Button";
import './ProductItem.css';
import FullScreenProduct from '../FullScreenProduct/FullScreenProduct';

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


        // Через некоторое время сбросите состояние isButtonPressed
        // setTimeout(() => {
        //   setIsButtonPressed(false);
        // }, 200);

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
            <div style={{ marginTop: 'auto' }}>
                <Button className={buttonClassName} onClick={onAddHandler}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default ProductItem;