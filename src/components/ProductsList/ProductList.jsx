import React, { useState } from "react";
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import Spinner from "../Spinner/Spinner";
import { useTelegram } from "../../hooks/useTelegram"; 
import {useCallback, useEffect} from "react";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Masonry from 'react-masonry-css';

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

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
            token
        }
        fetch('https://wolf.shiba.kz/web-data',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
              throw new Error('Request failed');
            }
            // Дополнительная обработка ответа, если необходимо
            console.log('Request successful');
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }, [addedItems])


    useEffect(() => {
        console.log('111');        
        setIsLoading(true);
        async function fetchData() {
            try{                
                const response = await fetch('https://shiba.kz/api/goods');
                const jsonData = await response.json();
                setProducts(jsonData.products);
                setToken(jsonData.csrf_token);
                setIsLoading(false);
                console.log(jsonData);
            }
            catch (e)
            {
                console.log(e);
            }
        }
        console.log('222');        
        fetchData();

        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
        
    }, [addedItems]);

    

    const onAdd = (product) =>{
        console.log(token);
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded)
        {
            newItems = addedItems.filter(item => item.id !== product.id);
        }
        else
        {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0)
        {
            tg.MainButton.hide();
        }
        else
        {
          const goodsCount = newItems.length;
          console.log( `Оформить заказ (${goodsCount} тов. по цене: ${getTotalPrice(newItems)} тнг)`);
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Оформить заказ (${goodsCount} тов. по цене: ${getTotalPrice(newItems)} тнг)`
            })
        }
    }
    

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
          </Accordion>
        )}</div>
      );
}

export default ProductList;