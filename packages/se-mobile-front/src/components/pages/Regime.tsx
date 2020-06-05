import * as router from '@sha/router/index';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import appStorage from 'se-iso/src/appStorage';
import { nav } from '../../nav';
import { selectCurrentUser } from '../../store/clientReducer';
import { loginDuck } from '../../store/loginDuck';
import Chat from '../Chat'
import React from 'react'

export default () => {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  
  const onExit = () =>{

      dispatch(loginDuck.actions.signIn.unset())
      appStorage.setItem('credentials', undefined)
      dispatch(router.replace(nav.signIn)())

  }

  return <div>
            Вы вошли как {user.email}
            <br/>
            Ваш баланс {user.balance}
            <br/>
            <Button onClick={onExit}>Выйти</Button>
              <br/>
              <br/>
            <Chat/>
        </div>
}