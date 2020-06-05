import { useSelector } from 'react-redux'
import {bootstrapDuck} from 'se-iso'
export default () => 
    useSelector(bootstrapDuck.selectBootstrap)