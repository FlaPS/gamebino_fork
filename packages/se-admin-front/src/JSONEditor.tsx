import React from 'react'
import { JsonEditor as Editor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'
import {WithValueProps} from './types'
import {SEServiceConfig} from '../../se-service/src/SEServiceConfig'
import Ajv from 'ajv';
import ace from 'brace'
import 'brace/mode/json';
import 'brace/theme/github';
const ajv = new Ajv({ allErrors: true, verbose: true });


export default ({value, onValueChange}: WithValueProps<SEServiceConfig>) => {
    return      <Editor
                    value={value}
                    onChange={onValueChange}
                    ace={ace}
                    theme="ace/theme/github"
                    schema={ajv}
                />
}