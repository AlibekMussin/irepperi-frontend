import React, { useState } from "react";
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import { useTelegram } from "../../hooks/useTelegram"; 
import {useCallback, useEffect} from "react";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';


const getTotalPrice = (items) =>{
    return items.reduce((acc, item)=>{
        return acc += item.price
    }, 0);
    
}

const ProductList = () =>{
    const [addedItems, setAddedItems ] = useState([]);
    const {tg, queryId} = useTelegram();
    const [products, setProducts] = useState([]);

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
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
        
        async function fetchData() {
            try{
                const response = await fetch('https://shiba.kz/api/goods');
                const jsonData = await response.json();
                setProducts(jsonData);
                // console.log(jsonData);
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
    }, [onSendData]);

    const onAdd = (product) =>{
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
            tg.MainButton.show();
            tg.MainButton.setParams({
                text:`Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className="list">
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
                  <div className="section-items">
                    {section.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`section-item ${index % 4 === 3 ? 'last-in-row' : ''}`}
                      >
                        <ProductItem
                          product={item}
                          onAdd={onAdd}
                          className={'item'}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
}

export default ProductList;