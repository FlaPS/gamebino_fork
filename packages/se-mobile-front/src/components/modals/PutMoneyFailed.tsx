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
import {uiDuck} from '../../store/uiDuck'



export default () => {
    const dispatch = useDispatch()

    const onClose = () =>
        dispatch(uiDuck.actions.hidePopUp(uiDuck.modalTypes.PutMoneyFailedModal))

    return  <SEModal onClose={onClose}>
                <SEList>
                    <SEListHeading>
                        Ой!
                    </SEListHeading>
                    <SEListHeading>
                        Оплата была отклонена.
                    </SEListHeading>
                    <Div>

                        <br/>
                        <p>
                            Пожалуйста, попробуйте снова.
                        </p>
                        <br/>
                        <br/>
                    </Div>
                    <GreenButton
                        onClick={onClose}
                    >
                        Хорошо
                    </GreenButton>
                </SEList>
            </SEModal>
}