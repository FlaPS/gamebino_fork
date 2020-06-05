import { generateGuid } from '@sha/random/src/index';
import React from 'react'
import * as R from 'ramda'
import {api, CredentialsVO} from 'se-iso/src'
import {useDispatch, useSelector} from 'react-redux'
import * as router from '@sha/router'
import { usersDuck } from 'se-iso/src/store/usersDuck';
import {nav} from '../../nav'

import { Form, Input, Button, Checkbox } from 'antd'
import {connect} from 'react-redux'
import {emailValidation} from '@sha/utils'
import appStorage from 'se-iso/src/appStorage'
import {SEClientState} from '../../store/clientReducer'
import {loginDuck} from '../../store/loginDuck'
import useApi from '../../hooks/useApi'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const SignInPage = ({loginState}: {loginState}) => {

    const dispatch = useDispatch()

    const [state, setState] = React.useState({remember: true} as any as CredentialsVO)
    const [isLoading, setIsloading] = React.useState(false)
    const [loginError, setLoginError] = React.useState(undefined)

    const onChange = <T extends  keyof CredentialsVO>(prop: T) =>
        (value: CredentialsVO[T]) =>
            setState(R.assoc(prop, value, state))


    const onRegister = () => {

      dispatch(usersDuck.actions.registered.started({
        user: {
          ...state,
          userId: generateGuid(),
        }
      }))
    }

    const api = useApi()
    const onLogIn = async () => {
        setIsloading(true)
        try {
            const result = await api.signIn(state)
            console.log(result)
            if (result.result) {
                if (state.remember)
                    appStorage.setItem('credentials', state)
                dispatch(loginDuck.actions.signIn.done(
                    {
                        params: state,
                        result: result.result,
                    }
                ))

                dispatch(router.push(nav.regime )())
            } else {
                setState({...state, password: ''})

                setIsloading(false)
                setLoginError('Неверный логин и/или пароль')
            }
        } catch (e) {
            setState({...state, password: ''})

            setIsloading(false)
            setLoginError('Неверный логин и/или пароль')
        }

    }

    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}

      >
        <Form.Item
          label="Username"
          name="email"
        >
          <Input value={state.email} onChange={ e => onChange('email')(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
        >
          <Input value={state.password} onChange={ e => onChange('password')(e.target.value)} />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" onClick={onLogIn}>
            Login
          </Button>
          <Button type="primary" htmlType="submit" onClick={onRegister}>
            Register
          </Button>
        </Form.Item>
      </Form>
    )
}

export default connect( (state: SEClientState) => ({loginState: state.app.login}) )(SignInPage)