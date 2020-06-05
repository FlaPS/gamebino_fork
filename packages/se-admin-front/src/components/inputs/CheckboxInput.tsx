import React, {useContext} from 'react'
import {Checkbox} from 'antd'
import {WithValueProps} from '@sha/react-fp'
import {DisabledContext} from '../../contexts'

export type CheckboxInputProps = WithValueProps<boolean> & {inverted?: boolean}

const CheckboxInput = React.memo(
    ({value, onValueChange, inverted, ...props}: CheckboxInputProps) =>
        <Checkbox
            {...props}
            disabled={useContext(DisabledContext)}
            checked={inverted ? !value : value}
            onChange={(e) => {
                if (onValueChange)
                    onValueChange(
                        inverted
                            ? !e.target.checked
                            : e.target.checked
                    )
                }
            }
        />
)

export default CheckboxInput