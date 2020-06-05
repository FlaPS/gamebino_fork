import {api} from 'se-iso/src'
import {useSelector} from 'react-redux'

const useApi = () =>
    api(useSelector(state => state))

export default useApi
