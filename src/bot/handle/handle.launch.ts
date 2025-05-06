import { Injectable } from '@nestjs/common'
import { Context } from 'telegraf'
import { BotEffect } from '../bot.effect'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilsService } from 'src/utils/utils.service'
import { BotKeyboard } from '../bot.keyboard'
import { Cron } from '@nestjs/schedule'
import { MinioService } from 'src/minio/minio.service'
import { MinioKeys } from 'src/minio/minio.keys'

@Injectable()
export class HandleLaunch {
  constructor (
    private readonly effect: BotEffect,
    private readonly prisma: PrismaService,
    private readonly keyboard: BotKeyboard,
    private readonly minio: MinioService,
  ) {}

  @Cron('0 * * * * *')
  handleCron () {
    this.handleUpdate()
  }

  private handleUpdate = async () => {
    const date = new Date(Date.now() - 48 * 60 * 60 * 1000)
    await this.prisma.passCode.deleteMany({
      where: {
        active: true,
        createdAt: {
          lt: date,
        },
      },
    })
  }

  action = async (ctx: Context) => {
    await this.effect.delete(ctx)
    await ctx.reply('<b>Выберите установочник:</b>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.keyboard.launcher(),
      },
    })
  }

  weChat = async (ctx: Context) => {
    await this.effect.delete(ctx)

    await ctx.reply('<b>💚 WeChat:</b>\n\n', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.keyboard.launcherCode(),
      },
    })
  }

  zoom = async (ctx: Context) => {
    await this.effect.delete(ctx)
    await ctx.reply('<b>💙 Zoom:</b>\n\n', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.keyboard.launcherCode(),
      },
    })
  }

  code = async (ctx: Context) => {
    await this.effect.delete(ctx)
    const worker = await this.prisma.worker.findUnique({
      where: {
        telegramId: ctx.from.id.toString(),
      },
    })
    if (!worker) {
      return
    }
    const code = await this.prisma.passCode.create({
      data: {
        workerId: worker.id,
      },
    })
    await ctx.reply('<b>Секретный код:</b>\n\n' + `<code>${code.id}</code>`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: this.keyboard.back(),
      },
    })
  }
}
