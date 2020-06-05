import React from 'react'
import {UserVO, PlanCustomDecorScheme} from 'se-iso/src/store/usersDuck'
import * as R from 'ramda'

const TrainerMeta = ({trainer, scheme = 'custom-0' }: {trainer: UserVO, scheme: string}) => {

    const schemeIndex = (scheme || '').split('-')[1]
    const schemeType = (scheme || '').split('-')[0]


    if(schemeType !== 'custom')
        return null

    const schemeObj: Partial<PlanCustomDecorScheme> =
        (trainer.planDecor && trainer.planDecor.customSchemes ? trainer.planDecor.customSchemes[schemeIndex] : undefined) || {}
    //console.log('scheme', scheme, schemeObj)
    if(schemeObj.hideContacts) {
        //console.log('hide contacts')
        return null
    }
    //console.log('render contacts')
    return <div className="trainer_meta">
        {
            schemeObj.photo &&

            <div className="trainer_avatar">
                <img
                    src={schemeObj.photo}
                    alt=""/>
            </div>
        }
        <div className="trainer_info">
            <div className="trainer_name">
                {
                    schemeObj.fullName
                }
            </div>
            {
                schemeObj.phone &&
                <div className="phone" >


                <a  href={"tel:"+ schemeObj.phone}>
                    {
                        schemeObj.phone
                    }
                </a>
                </div>
            }
            {/*<br/>*/}
            {
                schemeObj.instagram &&
                <div className="instagram">
                <a  href={schemeObj.instagram}>
                    {schemeObj.instagram}

                </a>
                </div>
            }
            {/*<br/>*/}
            {
                schemeObj.extraInfo &&
                <div className="instagram">
                <a href={schemeObj.extraInfo}>
                    {schemeObj.extraInfo}

                </a>
                </div>
            }
        </div>
    </div>
}

export default TrainerMeta