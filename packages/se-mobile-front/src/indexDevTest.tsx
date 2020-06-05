import React from 'react'
import ReactDOM from 'react-dom'
import { sleep } from '@sha/utils/src'
import { useAsyncState } from '@sha/react-fp/src'
import { APIResponse } from 'se-iso/src/utils/asyncWorker'
import useApi from './hooks/useApi'

type VO = {
    email: string //'invalid email' | 'email is used'
    password: string //'to weak'
    name: string //'name id busy'
}

type Errors<T> = {
    [P in keyof T]: string
}

type Response = Partial<Errors<VO>>

const api = (options: {}) => ({
    login: async (payload: Partial<VO>): Promise<APIResponse<Response>> => {
        await sleep(1000)
        return {
            result : {
                name: 'name is busy ' + payload.name,
                email: 'Email is busy',
                password: 'pwd is too short',
            }
        }}
})



const App = () => {

    const [state, setState] = React.useState({} as Partial<VO>)

    const [isSigninUp, setIsSigningUp] = React.useState(null as Partial<VO>)

    const onChange = (key) => value => 
        setState({...state, [key]: value})

    const api = useApi()
    const asyncResult = useAsyncState(api.login, isSigninUp)

    const getFieldProps = (key: keyof Partial<VO>) => ({
        onValueChange: onChange(key),
        value: state[key],
        id: key,
        name: key,
        error: asyncResult.value && asyncResult.value[key]
    })

    const onSignUp = () => {
        setIsSigningUp(state)
    }

    return  <div>
                <Field {...getFieldProps('name')}></Field>
                <Field {...getFieldProps('email')}></Field>
                <Field {...getFieldProps('password')}></Field>
                <button
                    disabled={asyncResult.status === 'started'}
                    onClick={onSignUp}
                >
                    Sign Up
                </button>
            </div>
}


type FieldProps = {
    value: string
    onValueChange?: (value: string) => any
    name: string
    error?: string
}


const Field = ({value, onValueChange, name, error}: FieldProps) => {

    return  <label style={{display: 'block'}}>{name}
                <input value={value} onChange={e => onValueChange(e.target.value)} />
                <ErrorText>{error}</ErrorText>
            </label>
}

const ErrorText = ({children}) => 
    children 
        ? <span style={{color: 'red'}} >{children}</span>
        : null


const div = document.getElementById('root') as HTMLDivElement

ReactDOM.render(
    <App />,
    div
)

