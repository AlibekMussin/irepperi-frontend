import React, { useState } from 'react';
import './FullScreenProduct.css';

const FullScreenProduct = ({ imageUrl, onClose }) => {
  return (
    <div className="full-screen-image">
      <img src={imageUrl} alt="Full Screen" />
      <button className="close-button" onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
};
export default FullScreenProduct;