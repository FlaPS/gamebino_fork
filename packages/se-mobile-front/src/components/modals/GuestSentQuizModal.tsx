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
import {plansDuck} from 'se-iso'


export default () => {
    const dispatch = useDispatch()
    return  <SEModal isOpen={true}>
                <SEList>
                    <SEListHeading>
                        Спасибо! Мы получили вашу анкету
                    </SEListHeading>
                    <Div>

                        Сейчас вы перейдете на страничку с планом.

                        <br/><br/>

                        И мы выслали демонстрационный план вам на почту, чтобы он не потерялся :)

                        <br/><br/>

                        Проверьте папку спам, если нет в основной почте.

                        <br/><br/><br/>
                    </Div>
                    <GreenButton
                        onClick={() => dispatch(uiDuck.actions.hidePopUp(uiDuck.modalTypes.GuestSentQuizModal))}
                    >ОК</GreenButton>
                </SEList>
            </SEModal>
}