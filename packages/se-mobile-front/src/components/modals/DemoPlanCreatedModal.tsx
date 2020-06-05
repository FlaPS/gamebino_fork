import React from 'react'
import {Div, Image, Modal} from 'atomize'
import GreenButton from '../buttons/GreenButton'
import * as router from '@sha/router'
import {nav} from '../../nav'
import {useDispatch} from 'react-redux'
import SEList from '../parts/SEList'
import SEListHeading from '../parts/SEListHeading'
import SEModal from './SEModal'
import {plansDuck} from 'se-iso'

export default ({isOpen, plan}) => {

    const dispatch = useDispatch()

    const onOk = () => {
        dispatch(router.push(nav.demoMyClientPlan)({planId: plan.planId}))
    }

    return      <SEModal isOpen={isOpen} onClose={onOk} >
                    <Image src={'/assets/planPayed.png'} h={'15rem'}></Image>
                    <SEList>
                        <SEListHeading>
                            Спасибо! Мы получилив ашу анкету {plan.profile.fullName}.
                        </SEListHeading>
                        Сейчас вы перейдете на страничку с планом.
                        <br/>

                        И мы выслали план на {plansDuck.getDemoPlanDuration(plan)}, вам на почту, чтобы он не потерялся :)
                    
                        <br/>
                        Проверьте папку спам, если нет в основной почте.
                        <GreenButton
                            onClick={onOk}
                        >
                            К плану
                        </GreenButton>
                    </SEList>
                </SEModal>
}