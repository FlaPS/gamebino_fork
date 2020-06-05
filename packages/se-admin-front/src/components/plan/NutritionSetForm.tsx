import React from 'react'
import {WithValueProps} from '@sha/react-fp'
import {getProfileTargetKCals,Profile } from 'se-iso/src/ProfileVO'
import {InputNumber, Checkbox} from 'antd'

const style = {
    textAlign: 'center',
    justifyContent: 'center',
    minWidth: '100px'
}

const NutritionSetForm = ({value, onValueChange}: WithValuePropsProfileVO) => {
    const targetKCals = getProfileTargetKCals(value)
    const profile = value

    const percentDisbalance = Math.round((profile.proteinPart + profile.fatsPart + profile.carbonsPart) * 100)

    return <table>
        <tr>
            <th></th>
            <th style={style}>Б</th>
            <th style={style}>Ж</th>
            <th style={style}>У</th>
            <th style={style}>К</th>
        </tr>
        <tr >
            <td>
                кг
            </td>
            <td style={style}>
                <InputNumber
                    min={1} max={100}

                    value={Math.ceil(value.proteinPart * 100)}
                    onChange={
                        (value) =>
                            onValueChange({...profile, proteinPart: value /100})
                    }
                    style={{width: '60px'}}
                />
            </td>
            <td style={style}>
                <InputNumber
                    min={1} max={100}

                    value={Math.ceil(value.fatsPart * 100)}

                    onChange={
                        (value) =>
                            onValueChange({...profile, fatsPart: value /100})
                    }
                    style={{width: '60px'}}
                />
            </td>
            <td style={style}>
                <InputNumber
                    min={1} max={100}

                    value={Math.ceil(value.carbonsPart * 100)}

                    onChange={
                        (value) =>
                            onValueChange({...profile, carbonsPart: value /100})
                    }
                    style={{width: '60px'}}
                />
            </td>
            <td style={style}>
                <span
                    style={{color: percentDisbalance === 100
                        ? 'black'
                        : 'red'
                    }}
                > {percentDisbalance} % </span>
            </td>
        </tr>
        <tr >
            <td>
                <Checkbox checked={profile.usePerKG} onChange={e => {
                    const usePerKG = e.target.checked
                    const nutsPerKG = usePerKG
                        ? {
                            proteins: Math.round(profile.proteinPart * targetKCals / profile.weight /4 * 100) / 100,
                            fats: Math.round(profile.fatsPart * targetKCals / profile.weight /9 * 100) / 100,
                            carbons: Math.round(profile.carbonsPart * targetKCals / profile.weight /4 * 100) / 100
                        }
                        : profile.nutsPerKG
                    onValueChange({
                        ...profile,
                        nutsPerKG,
                        usePerKG,
                    })
                }}> гр/кг</Checkbox>
            </td>
            <td style={style}>
                <InputNumber
                    min={0} max={20}
                    step={0.01}
                    disabled={!profile.usePerKG}
                    value={
                        profile.usePerKG
                            ? profile.nutsPerKG.proteins
                            : Math.round(profile.proteinPart * targetKCals / profile.weight /4 * 100) / 100
                    }
                    onChange={
                        (value) =>
                            onValueChange({
                                ...profile,
                                proteinPart: value * 4 / (value * 9+ profile.nutsPerKG.carbons * 4 + profile.nutsPerKG.proteins * 4),
                                nutsPerKG: {
                                    ...profile.nutsPerKG,
                                    fats: value
                                }
                            })
                    }
                    style={{width: '60px'}}
                />
            </td>
            <td style={style}>
                <InputNumber
                    min={0} max={20}
                    step={0.01}
                    disabled={!profile.usePerKG}
                    value={
                        profile.usePerKG
                            ? profile.nutsPerKG.fats
                            : Math.round(profile.fatsPart * targetKCals / profile.weight /9 * 100) / 100
                    }
                    onChange={
                        (value) =>
                            onValueChange({
                                ...profile,
                                fatsPart: value * 9 / (value * 9 + profile.nutsPerKG.carbons * 4 + profile.nutsPerKG.proteins * 9),
                                nutsPerKG: {
                                    ...profile.nutsPerKG,
                                    fats: value
                                }
                            })
                    }
                    style={{width: '60px'}}
                />
            </td>
            <td style={style}>
                {Number(value.carbonsPart * targetKCals / profile.weight/4).toFixed(2)}
            </td>

            <td></td>
        </tr>
        <tr>
            <td>Итого</td>
            <td style={style}>{Math.round(targetKCals * value.proteinPart  / 4)}</td>
            <td style={style}>{Math.round(targetKCals * value.fatsPart  / 9)}</td>
            <td style={style}>{Math.round(targetKCals * value.carbonsPart  / 4)}</td>
            <td style={style}>{Math.round(
                targetKCals * value.proteinPart  +
                targetKCals * value.fatsPart +
                targetKCals * value.carbonsPart
            )} ККалл</td>
        </tr>
    </table>
}

export default NutritionSetForm