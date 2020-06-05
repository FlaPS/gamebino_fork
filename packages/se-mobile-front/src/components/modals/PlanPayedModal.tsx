import React from 'react'
import {Div, Image, Modal} from 'atomize'
import GreenButton from '../buttons/GreenButton'
import SecondaryButton from '../buttons/SecondaryButton'
import * as router from '@sha/router'
import {nav} from '../../nav'
import PageLayout from '../parts/PageLayout'
import {useDispatch} from 'react-redux'
import SEList from '../parts/SEList'
import SEModal from './SEModal'


export default ({isOpen, onClose, plan}) => {
    const dispatch = useDispatch()
    return  <SEModal isOpen={isOpen} onClose={onClose} textAlign={'center'}>
                <Image src={'/assets/ui/planPayed.png'} h={'15rem'}></Image>
                <SEList>
                <Div w={'100%'} textAlign={'center'} textSize={'1rem'} m={{t: '2rem'}}>
                    План для клиента {plan.profile.fullName} оплачен и создан.
                </Div>
                <GreenButton
                    onClick={() =>  dispatch(router.push(nav.myClientPlan)({planId: plan.planId}))}
                >К плану</GreenButton>
                <SecondaryButton onClick={() => dispatch(router.push(nav.myClients)())}>Список планов</SecondaryButton>
                </SEList>
            </SEModal>
}