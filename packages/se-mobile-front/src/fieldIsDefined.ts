
export default (value: string | number | undefined | null | []): boolean => {
    if (value === undefined || value === null)
        return false

    if(typeof value === 'string')
        value.trim().length > 0

    if(typeof value === 'number')
        return true

    return value.length > 0
}
