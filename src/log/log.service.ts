import { Injectable, Logger } from '@nestjs/common'
import { Request } from 'express'
import { BotService } from 'src/bot/bot.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { LogQuery } from './log.dto'
import { MinioService } from 'src/minio/minio.service'
import { MinioKeys } from 'src/minio/minio.keys'

@Injectable()
export class LogService {
  private readonly logger = new Logger('LogService')
  constructor (
    private readonly prisma: PrismaService,
    private readonly bot: BotService,
    private readonly minio: MinioService,
  ) {}

  log = async (request: Request) => {
    try {
      const ip = this.ip(request)
      const userAgent = request.headers['user-agent']
      const host = request.headers['host']
      this.logger.log(`${ip} ${host} ${userAgent}`)
      const [prefix, domain] = this.host(host)
      if (!prefix) {
        return
      }
      const subDomain = await this.prisma.subDomain.findFirst({
        where: {
          prefix,
          domain: {
            domain,
          },
        },
      })
      if (!subDomain) {
        this.logger.warn('Not found domain')
        return
      }
      const log = await this.prisma.log.create({
        data: {
          subDomainId: subDomain.id,
          workerId: subDomain.workerId,
          ip,
          userAgent,
        },
      })
      this.bot.newLog(log.id)
    } catch (ex) {
      this.logger.error(ex)
    }
  }
  param = async (request: Request, { id }: LogQuery) => {
    try {
      const ip = this.ip(request)
      const userAgent = request.headers['user-agent']
      const host = request.headers['host']
      this.logger.log(`${ip} ${host} ${userAgent}`)

      const code = await this.prisma.passCode.update({
        where: {
          id,
          active: true,
        },
        data: {
          active: false,
        },
      })
      if (!code) {
        this.logger.warn('Invalid code')
        return {
          urls: [],
        }
      }
      const log = await this.prisma.log.create({
        data: {
          ip,
          userAgent,
          passCodeId: code.id,
        },
      })
      this.bot.newLog(log.id)
      const data = await this.minio.get(MinioKeys.stfile, 'urls.json')
      return {
        urls: JSON.parse(data.toString()),
      }
    } catch (ex) {
      this.logger.error(ex)
      return {
        urls: [],
      }
    }
  }

  private ip = (request: Request) => {
    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress
    return Array.isArray(ip) ? ip[0] : ip
  }

  private host = (host?: string) => {
    if (!host) return [null, null]

    const parts = host.split('.')

    if (parts.length >= 2) {
      const subdomain = parts.length > 2 ? parts[0] : null
      const domain = parts.slice(-2).join('.')

      return [subdomain, domain]
    }
    return [null, host]
  }
}
