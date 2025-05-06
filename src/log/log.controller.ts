import { Controller, Get, Param, Req } from '@nestjs/common'
import { LogService } from './log.service'
import { Request } from 'express'
import { LogQuery } from './log.dto'

@Controller('/log')
export class LogController {
  constructor (private readonly log: LogService) {}
  @Get('/')
  handle (@Req() request: Request) {
    this.log.log(request)
    return 'ok'
  }
  @Get('/:id')
  async param (@Req() request: Request, @Param() param: LogQuery) {
    const res = await this.log.param(request, param)
    return res 
  }
}