import React from 'react'
import {Div, Image, Modal} from 'atomize'
import GreenButton from '../buttons/GreenButton'
import SecondaryButton from '../buttons/SecondaryButton'
import * as router from '@sha/router'
import {nav} from '../../nav'
import PageLayout from '../parts/PageLayout'
import {useDispatch} from 'react-redux'
import SEList from '../parts/SEList'
import SEListHeading from '../parts/SEListHeading'
import SEModal from './SEModal'


export default ({isOpen, onClose}) => {
    const dispatch = useDispatch()
    return  <SEModal isOpen={isOpen} onClose={onClose}>
        <SEList>
            <SEListHeading>
                Спасибо! Мы получили ваши данные
            </SEListHeading>
            <Div>
                Спасибо!
                <p/>
                Подтверждение аккаунта занимает до 24 часов.
                <br/>
                Мы пришлем Вам электронное письмо о результатах.
                <p/>
                Наберитесь терпения :)
            </Div>
            <GreenButton
                onClick={onClose}
            >Готово</GreenButton>
        </SEList>
    </SEModal>
}