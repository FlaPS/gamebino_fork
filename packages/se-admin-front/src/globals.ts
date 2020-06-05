import queryString from 'query-string'

export type SEClientCofnig = {
    http2Gateway: string

}

const defaultConfig: SEClientCofnig = {
    http2Gateway: process.env.HTTP_GATEWAY || 'https://localhost:3000/api/v0.1',
}


const parsed: Partial<SEClientCofnig> = queryString.parse(location.search)

export const globals = {...defaultConfig, ...parsed}