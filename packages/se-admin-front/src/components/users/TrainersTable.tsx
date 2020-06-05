import React from 'react'
import * as A from 'antd'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {useDispatch, useSelector} from 'react-redux'
import {ColumnProps} from 'antd/lib/table'
import moize from 'moize'
import {
    arrPropSorter,
    checkSearch,
    createDateColumn,
    createDeleteCellColumn,
} from '../tableUtils'
import TrainersCard from './TrainersCard'
import {AsyncStatus} from '../../../../fsa/src'
import {SEAdminState} from '../../store/adminReducer'
import basicColumn from '../table/basicColumn'
import StringCell from '../cells/StringCell'
import NumberCell from '../cells/NumberCell'
import {SearchContext} from '../../contexts'
import {campaignsDuck} from 'se-iso/src'

const Search = A.Input

const verifySortableValues: Array<AsyncStatus> = [
    'started',
    'done',
    'failed',
    'unset',
]


const CampaignCell = ({campaignId}) => {
    const campaign = useSelector(campaignsDuck.selectById(campaignId))
    return <div>{campaign ? (campaign.name) : campaignId}</div>
}

const getColumns = moize(
    ({dispatch, page}): ColumnProps<UserVO>[] =>
        [
            {
                dataIndex: 'email',
                render: (text: any, record: UserVO, index: number) =>
                    (index + 1) + ((page || 1) - 1) * 50
            },
            basicColumn<UserVO, string>({
                cell: StringCell,
                title: 'email',
                dataIndex: 'email',
                duck: usersDuck,
                cellProps: {
                   style: {
                       width: '300px'
                   }
                }
            }),
            basicColumn<UserVO, string>({
                cell: StringCell,
                title: 'password',
                dataIndex: 'password',
                duck: usersDuck,
            }),
            basicColumn<UserVO>({
                dataIndex: 'fullName',
                title: 'Имя'
            }),
            basicColumn<UserVO>({
                dataIndex: 'phone',
                title: 'Телефон'
            }),
            createDateColumn<UserVO>('Регистрация', 'createdAt'),
            basicColumn<UserVO>({
                dataIndex: 'balance',
                title: 'Баланс'
            }),
            {
                dataIndex: 'campaignId',
                title: 'Кампания',
                render: (value, user: UserVO) => {

                    console.log('0')
                    return <CampaignCell campaignId={user.campaignId}/>
                }
            },
                createDeleteCellColumn('' , 'userId', usersDuck.actions.removed)
        ]
)

const searchable: Array<keyof UserVO>= ['fullName', 'email', 'userId', 'phone']

const TrainersTable = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = React.useState('')
    const [state, setState] = React.useState({page: 0, pageSize: 50})
    let data = useSelector( (state: SEAdminState) => state.app.bootstrap.users)

    if (search && search.trim().length) {
        const searcher = checkSearch<UserVO>(searchable)(search)
        let result = []
        for(let i = 0; i < data.length; i++) {
            if(searcher(data[i]))
                result.push(data[i])
        }
        data = result
    }


    const expandedRowRender = (user: UserVO) =>
        <TrainersCard value={user} />

    return  <div>
                    <Search value={search} placeholder={'Email, имя, телефон или userId'} onChange={e => setSearch(e.target.value)} style={{width: '400px'}} />
                    <SearchContext.Provider value={search ? search : undefined}>
                        <A.Table
                            pagination={{
                                pageSize: 50,
                                onChange:(page: number, pageSize: number) => {
                                    setState({page, pageSize})
                                }
                            }}
                            columns={getColumns({dispatch, page: state.page})}
                            dataSource={data}
                            rowKey={'userId'}
                            expandedRowRender={expandedRowRender}
                        >
                        </A.Table>
                    </SearchContext.Provider>
            </div>
}

export default TrainersTable
