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
import PromoCard from './PromoCard'
import {AsyncStatus} from '../../../../fsa/src'
import {SEAdminState} from '../../store/adminReducer'
import {generateNewPromo, promoCodesDuck, PromoVO} from 'se-iso/src/store/promoCodesDuck'
import makeOptics from '@sha/utils/src/makeOptics'
import StringInput from '../inputs/StringInput'
import lengthGetter from 'se-iso/src/utils/lengthGetter'
import basicColumn from '../table/basicColumn'
import DateCell from '../cells/DateCell'
import StringCell from '../cells/StringCell'
import {generateGuid} from '@sha/random'
import deleteColumn from '../table/deleteColumn'
import {UserVO} from 'se-iso/src/store/usersDuck'

const Search = A.Input

const verifySortableValues: Array<AsyncStatus> = [
    'started',
    'done',
    'failed',
    'unset',
]

const promoVOLens = Lens.fromProp<PromoVO>()
const activationsLens = promoVOLens('activations')

const activationsCountGetter = activationsLens.composeGetter(lengthGetter)

const getColumns =
    ({page, pageSize}): ColumnProps<PromoVO>[] =>
        [
            {
                dataIndex: 'name',
                render: (text: any, record: PromoVO, index: number) =>
                    (index + 1) + page * pageSize
            },
            basicColumn<PromoVO, string>({
                cell: StringCell,

                title: 'Название',
                dataIndex: 'name',
                duck: promoCodesDuck,
            }),
            basicColumn<PromoVO, string>({
                cell: StringCell,
                title: 'Промокод',
                width: 200,
                dataIndex: 'promoCode',
                duck: promoCodesDuck,
            }),
            {
                dataIndex: 'activations.length',
                width: 160,
                title: 'Активации',
                render: (value, record: PromoVO) =>
                    record.activations.length,
                //sorter: arrPropSorter<PromoVO>(activationsCountGetter.get),
            },
            basicColumn<PromoVO, string>({
                cell: DateCell,
                title: 'Запуск',
                dataIndex: 'restrictions.validFromDate',
                width: 160,
                duck: promoCodesDuck,
            }),
            basicColumn<PromoVO, string>({
                cell: DateCell,
                title: 'Окончание',
                dataIndex: 'restrictions.validThruDate',
                width: 160,
                duck: promoCodesDuck,
            }),
            deleteColumn(promoCodesDuck),
            //createDateColumn<PromoVO>('Создана', 'creationTimestamp'),
            //createDeleteCellColumn('' , 'promoId', promoCodesDuck.actions.remove)
        ]



const searchable: Array<keyof PromoVO>= ['name', 'promoCode', 'promoId']


const PromosTable = () => {
    const dispatch = useDispatch()

    /*if (search && search.trim().length)
        data = data.filter(
            checkSearch<PromoVO>(['name', 'promoCode'])
                (search)
        )
*/
    const renderTitle = (data: PromoVO[] ) => {
        return <Search value={search} placeholder={'Название, код, или email активатора'} onChange={e => setSearch(e.target.value)} style={{width: '300px'}} />
    }

    const handleCopy = ({activations, creationDate, promoId, ...rest}: PromoVO) => {
        setSearch('')
        dispatch(promoCodesDuck.actions.added(
            {
                ...generateNewPromo(),
                ...rest,
            }))
    }

    const expandedRowRender = (promo: PromoVO) =>
        <PromoCard value={promo} onCopy={handleCopy} />

    const onAdd = () => {
        setSearch('')
        dispatch(promoCodesDuck.actions.added(generateNewPromo()))
    }

    const [search, setSearch] = React.useState('')
    const [state, setState] = React.useState({page: 0, pageSize: 50})
    let data = useSelector( (state: SEAdminState) => state.app.bootstrap.promoCodes)
    if (search && search.trim().length)
        data = data.filter(
            checkSearch<PromoVO>(searchable)
            (search)
        )
    return  <div>
                    <A.Button onClick={onAdd} type="primary" style={{ marginBottom: 16 }}>
                        Добавить акцию
                    </A.Button>
                    <Search value={search} placeholder={'Id , код или название'} onChange={e => setSearch(e.target.value)} style={{width: '400px'}} />

                    <A.Table<PromoVO>
                        title={renderTitle}
                        pagination={{
                            pageSize: state.pageSize,
                            onChange:(page: number, pageSize: number) => {
                                setState({page, pageSize})
                            }
                        }}
                        columns={getColumns({page: state.page, pageSize: state.pageSize})}
                        dataSource={data}
                        rowKey={'promoId'}
                        expandedRowRender={expandedRowRender}
                    >
                    </A.Table>
            </div>
}

export default PromosTable
