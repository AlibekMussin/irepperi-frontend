import React, { useState } from "react";
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({product, className, onAdd}) => {
    const [isButtonPressed, setIsButtonPressed] = useState(false);

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

    return (
        <div className={'product ' + className}>
            <img className={'img'} src={product.image}/>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.price}</b></span>
            </div>
            <div style={{ marginTop: 'auto' }}>
                <Button className={'add-btn'} onClick={onAddHandler}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default ProductItem;