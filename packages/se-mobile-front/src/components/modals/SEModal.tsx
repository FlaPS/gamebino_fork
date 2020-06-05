import React, {ReactNode} from 'react'
import {Modal} from 'atomize'

type SEModalProps = {
    isOpen?: boolean
    onClose?: () => any
    textAlign?: 'left'| 'right' |'center'
    children: ReactNode
}

const SEModal = (props: SEModalProps) =>
    <Modal maxW={'26rem'} rounded={'md'} textAlign={'left'} isOpen={true} {...props}/>

export default SEModal

