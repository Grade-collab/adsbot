import { Injectable } from '@nestjs/common'
import { Context } from 'telegraf'
import { BotEffect } from '../bot.effect'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilsService } from 'src/utils/utils.service'
import { BotKeyboard } from '../bot.keyboard'

@Injectable()
export class HandleLogs {
  constructor (
    private readonly effect: BotEffect,
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly keyboard: BotKeyboard,
  ) {}

  action = async (ctx: Context) => {
    await this.effect.delete(ctx)
    let subDomainId = +((ctx as any)?.match?.[1] || '0')
    if (!subDomainId) {
      subDomainId = undefined
    }
    const logs = await this.prisma.log.findMany({
      where: {
        OR: [
          {
            worker: {
              telegramId: ctx.from.id.toString(),
            },
          },
          {
            passCode: {
              worker: {
                telegramId: ctx.from.id.toString(),
              },
            },
          },
        ],

        subDomainId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        ip: true,
        userAgent: true,
        subDomain: {
          select: {
            prefix: true,
            siteId: true,
            domain: {
              select: {
                domain: true,
              },
            },
          },
        },
      },
    })

    const logContent = logs
      .map(
        log =>
          `${log.id}. [${log.createdAt.toISOString()}] - ${
            log?.subDomain?.prefix||"null"
          }.${log?.subDomain?.domain?.domain||"null"} ${log.ip} ${log.userAgent}`,
      )
      .join('\n')
    const date = new Date()
    const buffer = Buffer.from(
      `${this.utils.date(date)}\n\n` + logContent,
      'utf-8',
    )
    await ctx.replyWithDocument(
      { source: buffer, filename: `logs_${ctx.from.id}_${date.getTime()}.txt` },
      {
        caption:
          `📜 <b>Выгрузка логов</b>\n\n` +
          `<b>Количество:</b> ${logs.length}\n` +
          `<b>Дата и время:</b> ${this.utils.date(date)}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: this.keyboard.back(),
        },
      },
    )
  }
}
