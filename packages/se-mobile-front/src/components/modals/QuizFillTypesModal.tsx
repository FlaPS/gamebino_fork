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
    return  <SEModal isOpen={isOpen} onClose={onClose} >
        <SEList>
            <SEListHeading>
                Анкету можно заполнить 3 способами:
            </SEListHeading>
            <Div>
                <p>
                    1. Заполнить анкету в личном кабинете самому.
                </p>

                <br/>
                <p>
                    2. Отправить/распечатать вордовский файл с анкетой клиенту. И потом заполнить 1-м способом.
                </p>
                <br/>
                <p>
                    3. Создать уникальную ссылку на вашу страничку с анкетой и дать ее клиенту.
                </p>


            </Div>
            <GreenButton onClick={() => dispatch(router.push(nav.newPlan)())}>
                ОК
            </GreenButton>
        </SEList>
    </SEModal>
}