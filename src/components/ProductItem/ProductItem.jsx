import React from 'react';
import Button from "../Button/Button";
import './ProductItem.css';

const ProductItem = ({product, className, onAdd}) => {

    const onAddHandler = () => {
        onAdd(product);
    }

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
        В корзину
      </Button>
    </div>
        </div>
    );
};

export default ProductItem;