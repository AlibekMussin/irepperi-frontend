import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram"; 
import './Form.css';

const Form = () =>{
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const {tg} = useTelegram();
    const onSendData = useCallback(()=>{
        const data = {
            country, street, subject
        }
        tg.sendData(JSON.stringify(data));


    }, [country, street, subject]);

    const onChangeCountry = (e) =>{
        setCountry(e.target.value)
    }
    const onChangeStreet = (e) =>{
        setStreet(e.target.value)
    }
    const onChangeSubject = (e) =>{
        setSubject(e.target.value)
    }

    useEffect(() => {
        tg.onEvent('mainButtonClicked', callback);
        return ()=>{
            tg.offEvent('mainButtonClicked', callback);
        }
    },[onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text:'Отправить'
        })
    },[]);

    useEffect(()=>{
        if (!country || !street)
        {
            tg.MainButton.hide();
        }
        else 
        {
            tg.MainButton.show();
        }
        
    },[country,street]);

    return (
        <div className={"form"}>
            <h3>Введите ваши данные</h3>
            <input className={'input'} type="text" placeholder={'Страна'} value={country} onChange={onChangeCountry}/>
            <input className={'input'} type="text" placeholder={'улица'} value={street} onChange={onChangeStreet}/>
            <select className={'select'} value={subject} onChange={onChangeSubject}>
                <option value={'physical'}>Физ. лицо</option>
                <option value={'legal'}>Юр. лицо</option>

            </select>

        </div>
    )
}

export default Form;