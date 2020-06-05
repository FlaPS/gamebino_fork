import React from 'react'
import {Div} from 'atomize'
import GreenButton from '../buttons/GreenButton'
import {useDispatch} from 'react-redux'
import SEList from '../parts/SEList'
import SEListHeading from '../parts/SEListHeading'
import SEModal from './SEModal'
import {uiDuck} from '../../store/uiDuck'

export default ({isOpen, onClose}) => {

    return  <SEModal isOpen={isOpen}>
        <SEList>
            <SEListHeading>
                Упс
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