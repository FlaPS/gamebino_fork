import React from 'react'
import {useDispatch} from 'react-redux'

import {UserVO} from 'se-iso/src/store/usersDuck'
import {connect, useSelector} from 'react-redux'

import {IngredientsPage} from '../IngridientsPage'
import {Tabs} from 'antd'
import PromosTable from './PromosTable'
import {SEAdminState} from '../../store/adminReducer'
const {TabPane} = Tabs



const PromosPage = () => {

    return <div>
                <PromosTable />

            </div>
}

export default PromosPage