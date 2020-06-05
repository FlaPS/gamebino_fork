import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Tabs} from 'antd'
import CampaignsTable from './CampaignsTable'
import {campaignsDuck} from 'se-iso/src'



const CampaignsPage = () => {


    return  <div>
                <CampaignsTable />

            </div>
}

export default CampaignsPage