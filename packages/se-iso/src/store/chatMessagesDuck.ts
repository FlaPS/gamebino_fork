import * as FSA from '@sha/fsa'
import * as R from 'ramda'
import {createCRUDDuck} from '@sha/fsa'


export type ChatMessageVO = {
  chatMessageId: string
  role: string
  text: string
  username: string
  userId: string
}


const duck = createCRUDDuck<ChatMessageVO, 'chatMessageId'>('chatMessages', 'chatMessageId')

const actions = {
  ...duck.actions,
}

export const chatMessagesDuck = {
  ...duck,
  actions,
  ...duck.optics,
}
