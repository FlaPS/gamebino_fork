import React from 'react'
import { JsonEditor as Editor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'
import Ajv from 'ajv';
import ace from 'brace'
import 'brace/mode/json';
import 'brace/theme/github';
import {WithValueProps} from '../types'
import {SEServiceConfig} from '../../../se-service/src/SEServiceConfig'
import {useSelector} from 'react-redux'
import {configDuck} from 'se-iso/src'
const ajv = new Ajv({ allErrors: true, verbose: true });


export default () => {
    const config = useSelector(configDuck.selectConfig)
    const [state, setState] = React.useState(config)
    return      <Editor
                    value={state}
                    onChange={setState}
                    ace={ace}
                    theme="ace/theme/github"
                    schema={ajv}
                />
}