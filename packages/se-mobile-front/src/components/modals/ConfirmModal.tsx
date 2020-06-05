import React from 'react'
import { Div, Button, Modal, Icon, Text } from "atomize"
import CloseIcon from '../buttons/CloseIcon'

const ConfirmModal = ({ isOpen, onClose, onOk, children, okText = 'Удалить', cancelText = 'Отмена'}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} align="center" rounded="md" maxW={'26rem'} >
            <CloseIcon onClick={onClose}/>
            <Div d="flex" m={{ b: "4rem" }}>
                <Icon
                    name="AlertSolid"
                    color="warning700"
                    m={{ t: "0.35rem", r: "0.5rem" }}
                />
                <div>
                    {children}
                </div>
            </Div>
            <Div d="flex" justify="space-between">
                <Button
                    onClick={onClose}
                    textColor="medium"
                    bg="gray200">
                    {cancelText}
                </Button>
                <Button
                    onClick={() => {
                        onOk()
                        onClose()
                    }}
                    bg="info700"

                    m={{ r: "1rem" }}
                >
                    {okText}
                </Button>

            </Div>
        </Modal>
    );
};

export default ConfirmModal