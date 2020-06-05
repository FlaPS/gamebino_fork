import {useSelector} from 'react-redux'
import {usersDuck} from 'se-iso/src/store/usersDuck'

export default () => {
    const user = useSelector(usersDuck.selectCurrentUser)

    return [user]
}
