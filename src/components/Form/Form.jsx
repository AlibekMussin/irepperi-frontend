import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram"; 
import './Form.css';

const Form = () =>{
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');

    const onChangeCountry = (e) =>{
        setCountry(e.target.value)
    }
    const onChangeStreet = (e) =>{
        setStreet(e.target.value)
    }
    const onChangeSubject = (e) =>{
        setSubject(e.target.value)
    }
    const {tg} = useTelegram();

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