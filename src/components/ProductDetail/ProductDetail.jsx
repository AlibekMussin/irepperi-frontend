import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useTelegram } from "../../hooks/useTelegram"; 

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
// import 'swiper/components/navigation/navigation.min.css';
// import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Navigation, Pagination]);


const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const {tg} = useTelegram();


    useEffect(() => {
        console.log('333');
        console.log(productId);
        
        async function fetchData() {
            try{
                const response = await fetch('https://shiba.kz/api/goods/'+productId);
                const jsonData = await response.json();
                setProduct(jsonData);
                console.log(jsonData);
            }
            catch (e)
            {
                console.log(e);
            }
        }
        console.log('444');        
        fetchData();
        tg.BackButton.show();
        tg.onEvent('backButtonClicked', function() {
          // Обработка события кнопки "назад"
          console.log("Нажата кнопка 'назад'");
          tg.goBack();
          // Дополнительные действия
        });
    
    }, []);

    // Получить информацию о товаре по ID из match.params
    // const productId = 0;
    // Здесь вы можете выполнить логику для получения подробной информации о товаре
    const { title, description, price, images } = product;
  
    return (
        <div className="product-detail">
          <h2 className="product-title">{title}</h2>
          <div className="product-description">{description}</div>
          <div className="product-price">Стоимость: <b>{price}</b></div>
          {/* <div className="product-images">
            {images?.map((image, index) => (
              <img
                key={index}
                className="product-image"
                src={image.image_src}
                alt={`Product Image ${index + 1}`}
              />
            ))}
          </div> */}

          <Swiper
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image.image_src} alt={`Photo ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      );
  };

export default ProductDetail;