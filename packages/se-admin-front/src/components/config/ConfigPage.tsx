import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {configDuck} from 'se-iso/src'
import {JSONEditor} from 'react-json-editor-viewer'
import {Button, Space} from 'antd'

export default () => {
    const dispatch = useDispatch()
    const config = useSelector(configDuck.selectConfig)
    const [value, setValue] = React.useState(config)

    const onCancelChanges = () =>
        setValue(config)

    const isSaveAvailable =
        JSON.stringify(value) !== JSON.stringify(config)

    const onSave = () => {
        const action = configDuck.actions.configUpdated(value)
        action.meta.persistent = true
        action.meta.userId = 'admin'
        action.userId = 'admin'
        dispatch(action)
    }

    const onJSONChange = (key, value, parent, data) =>
        setValue(data)
/*
    const onDefault = () => {
        setValue(defaultSEServiceConfig)
    }
     <Button type={'dashed'} onClick={onDefault}>По умолчанию</Button>
*/
    return  <div>
                <Space>

                    <Button type={'primary'} onClick={onSave} disabled={!isSaveAvailable}>Сохранить</Button>
                    <Button onClick={onCancelChanges} disabled={!isSaveAvailable}>Отмена</Button>
                </Space>
                <div>
                    <JSONEditor
                        showAddButton={false}
                        showRemoveButton={false}
                        data={value}
                        collapsible
                        onChange={onJSONChange}
                        view="dual"
                    />
                </div>

            </div>
}