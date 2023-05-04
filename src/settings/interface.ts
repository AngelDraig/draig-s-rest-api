import { Request } from "express"

export interface JwtVerifyUserInt{
    id: string,
    iat: number,
    exp: number
}

export interface JwtVerifyInt extends Request{
    user?: JwtVerifyUserInt
}