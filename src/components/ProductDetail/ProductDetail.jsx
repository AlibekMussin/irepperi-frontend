import React, { useState, useEffect } from "react";
import { useParams, useHistory  } from 'react-router-dom';
import { useTelegram } from "../../hooks/useTelegram"; 
import Spinner from "../Spinner/Spinner";
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './ProductDetail.css';

SwiperCore.use([Navigation, Pagination]);

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const {tg} = useTelegram();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        console.log('333');
        console.log(productId);
        
        async function fetchData() {
          setIsLoading(true);
            try{
                const response = await fetch('https://shiba.kz/api/goods/'+productId);
                const jsonData = await response.json();
                jsonData.description = jsonData.description.replace(/\n/g, '<br>');
                setProduct(jsonData);                
                setIsLoading(false);     
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
          console.log("Нажата кнопка 'назад'");          
          window.location.href = 'https://dazzling-centaur-bfa773.netlify.app';          
        });
    
    }, []);

    // Получить информацию о товаре по ID из match.params
    // const productId = 0;
    // Здесь вы можете выполнить логику для получения подробной информации о товаре
    const { title, description, price, images, main_image, info } = product;
  
    return (
        <div className="product-detail">
          {isLoading ? (
            <Spinner />
          ) : (<div>
          <h3 className="product-title">{title}</h3>
          <br></br>        
          <div className="product-description" style={{ whiteSpace: "pre-line" }}>{description.replace(/<br>/g, "\n")}</div>
          <div className="product-price">Стоимость: <b>{price}</b></div>
          <br></br>        
          {(images.length>0) ? 
          <Swiper
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image.image_src} alt={`Photo ${index + 1}`} style={{width:'100%'}} />
              </SwiperSlide>
            ))}
          </Swiper> : <img src={main_image} alt={`Main Photo`} style={{width:'100%'}} />
          }
          <br></br>
          <div className="product-info">{info.info_1?.map((info_div, index) => (
            <p>{info_div}</p>
          )) }</div><br></br>
          <div className="product-info">{info.info_2?.map((info_div, index) => (
            <p>{info_div}</p>
          )) }</div>
          </div>
          )}
        </div>
      );
  };

export default ProductDetail;