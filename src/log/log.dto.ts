import { IsString, IsUUID } from 'class-validator'

export class LogQuery {
  @IsString()
  @IsUUID()
  id: string
}
