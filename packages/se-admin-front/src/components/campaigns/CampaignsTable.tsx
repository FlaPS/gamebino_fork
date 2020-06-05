import React from 'react'
import * as A from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {ColumnProps} from 'antd/lib/table'
import moize from 'moize'
import {
    arrPropSorter,
    checkSearch,
    createDateColumn,
    createDeleteCellColumn,
} from '../tableUtils'
import {Lens} from 'monocle-ts'
import CampaignCard from './CampaignCard'
import {AsyncStatus} from '../../../../fsa/src'
import {SEAdminState} from '../../store/adminReducer'
import {generateNewPromo, promoCodesDuck} from 'se-iso/src/store/promoCodesDuck'
import makeOptics from '@sha/utils/src/makeOptics'
import StringInput from '../inputs/StringInput'
import lengthGetter from 'se-iso/src/utils/lengthGetter'
import basicColumn from '../table/basicColumn'
import DateCell from '../cells/DateCell'
import StringCell from '../cells/StringCell'
import {generateGuid, generatePassword} from '@sha/random'
import deleteColumn from '../table/deleteColumn'
import {UserVO} from 'se-iso/src/store/usersDuck'
import {campaignsDuck, CampaignVO} from 'se-iso/src'
import JSONTree from '../../JSONTree'
import useConfig from '../../../../se-mobile-front/src/hooks/useConfig'

const Search = A.Input

const verifySortableValues: Array<AsyncStatus> = [
    'started',
    'done',
    'failed',
    'unset',
]

const promoVOLens = Lens.fromProp<CampaignVO>()
const activationsLens = promoVOLens('activations')

const activationsCountGetter = activationsLens.composeGetter(lengthGetter)

const getColumns =
    ({page, pageSize}): ColumnProps<CampaignVO>[] =>
        [
            {
                dataIndex: 'name',
                render: (text: any, record: CampaignVO, index: number) =>
                    (index + 1) + page * pageSize
            },
            basicColumn<CampaignVO, string>({
                cell: StringCell,

                title: 'Название',
                dataIndex: 'name',
                duck: campaignsDuck,
            }),
            basicColumn<CampaignVO, string>({
                cell: StringCell,
                title: 'код',
                width: 200,
                dataIndex: 'code',
                duck: campaignsDuck,
            }),
            {
                dataIndex: 'visits.length',
                width: 70,
                title: 'Визиты',
                render: (value, record) =>
                    record.visits.length
               // sorter: true, //arrPropSorter<CampaignVO>(activationsCountGetter.get),
            },
            {
                dataIndex: 'leads.length',
                width: 70,
                title: 'Регистрации',
                render: (value, record) =>
                    record.leads.length
               // sorter: true, //arrPropSorter<CampaignVO>(activationsCountGetter.get),
            },
            {
                dataIndex: 'leads.length',
                width: 70,
                title: 'Конечники',
                render: (value, record) =>
                    record.personalUsers
                // sorter: true, //arrPropSorter<CampaignVO>(activationsCountGetter.get),
            },
            {
                dataIndex: 'leads.length',
                width: 70,
                title: 'Остальные',
                render: (value, record) =>
                    record.leads.length - record.personalUsers
                // sorter: true, //arrPropSorter<CampaignVO>(activationsCountGetter.get),
            },
            {
                dataIndex: 'plans.length',
                render: (value, record) =>
                    record.plans? record.plans.length : 0,
                width: 70,
                title: 'Планы',
                //sorter: true,
            },
            {
                dataIndex: 'plans.length',
                render: (value, record: CampaignVO) =>
                    record.leads.reduce((result, val) => result + val.totalDeposited, 0),
                width: 70,
                title: 'Депозиты',
                //sorter: true,
            },
            deleteColumn(campaignsDuck),
            //createDateColumn<CampaignVO>('Создана', 'creationTimestamp'),
            //createDeleteCellColumn('' , 'promoId', promoCodesDuck.actions.remove)
        ]



const searchable: Array<keyof CampaignVO>= ['name', 'campaignId', 'description', 'code']


const PromosTable = () => {
    const [config] = useConfig()
    const dispatch = useDispatch()
    let data = useSelector(campaignsDuck.selectAll)

    const renderTitle = ( ) => {
        return null//<Search value={search} placeholder={'Название, код, id или описание'} onChange={e => setSearch(e.target.value)} style={{width: '300px'}} />
    }
    const forPersonal = code =>
        config.frontendHost + '/personal.html?campaign='+code
    const forTrainers = code =>
        config.frontendHost + '/fitness.html?campaign='+code
    const forAll = code =>
        config.frontendHost + '/?campaign='+code
   const expandedRowRender = (item: CampaignVO) => {
       return   <div>
                    для всех: <a href={forAll(item.code)}>{forAll(item.code)}</a>
                    <p/>
                    для Тренеров: <a href={forTrainers(item.code)}>{forTrainers(item.code)}</a>
                    <p/>
                    для Пользователей: <a href={forPersonal(item.code)}>{forPersonal(item.code)}</a>
                    <p/>
                    <JSONTree value={item}></JSONTree>
                </div>
   }

    const onAdd = () => {
        setSearch('')
        dispatch(campaignsDuck.actions.added({
            campaignId: generateGuid(),
            code: generatePassword(),
            name: 'Кампания ' + (new Date()).toISOString(),
            leads: [],
            visits: [],
            plans: [],
            deposited: 0,
            budget: 0,
            leadsWithDeposit: 0,
        }))
    }

    const [search, setSearch] = React.useState('')
    const [state, setState] = React.useState({page: 0, pageSize: 50})
    if (search && search.trim().length)
        data = data.filter(
            checkSearch<CampaignVO>(searchable)
            (search)
        )
    return  <div>
        <A.Button onClick={onAdd} type="primary" style={{ marginBottom: 16 }}>
            Добавить кампанию
        </A.Button>
        <Search value={search} placeholder={'Id , код или название'} onChange={e => setSearch(e.target.value)} style={{width: '400px'}} />

        <A.Table<CampaignVO>
            title={renderTitle}
            pagination={{
                pageSize: state.pageSize,
                onChange:(page: number, pageSize: number) => {
                    setState({page, pageSize})
                }
            }}
            columns={getColumns({page: state.page, pageSize: state.pageSize})}
            dataSource={data}
            rowKey={'campaignId'}
            expandedRowRender={expandedRowRender}
        >
        </A.Table>
    </div>
}

export default PromosTable
