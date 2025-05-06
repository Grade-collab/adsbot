import { IsString, IsUUID } from 'class-validator'

export class ParseValid {
    @IsString()
    @IsUUID()
    secretKey: string
}