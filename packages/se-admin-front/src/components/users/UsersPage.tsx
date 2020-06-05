import React from 'react'
import {useDispatch} from 'react-redux'
import {Tabs} from 'antd'
import TrainersTable from './TrainersTable'
import { Typography } from 'antd';

const { Paragraph } = Typography;



const UsersPage = () => {
    const dispatch = useDispatch()

    return <div>

                <TrainersTable />

            </div>
}

export default UsersPage