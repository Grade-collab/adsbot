import { Injectable } from '@nestjs/common'
import { BotInline } from './bot.inline'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class BotKeyboard {
  constructor (private readonly config: ConfigService) {}
  back = () => {
    return [
      [
        {
          text: '🚀 Приступить к работе',
          callback_data: BotInline.start,
        },
      ],
    ]
  }

  subdomainSuccess = (id: number) => {
    return [
      [
        {
          text: '🚀 Приступить к работе',
          callback_data: `${BotInline.subdomain}_${id}`,
        },
      ],
    ]
  }
  subdomainCancel = (id: number) => {
    return [
      [
        {
          text: '⬅️  Вернуться назад',
          callback_data: `${BotInline.websites}_${id}`,
        },
      ],
    ]
  }

  launcher = () => {
    return [
      [
        { text: '💚 WeChat', callback_data: BotInline.launcher_wechat },
        { text: '💙 Zoom', callback_data: BotInline.launcher_zoom },
      ],
      [
        {
          text: '⬅️  Вернуться назад',
          callback_data: `${BotInline.start}`,
        },
      ],
    ]
  }

  launcherCode = () => {
    return [
      [{ text: '🔄 Генерация кода', callback_data: BotInline.launcher_code }],
      [
        {
          text: '⬅️  Вернуться назад',
          callback_data: `${BotInline.start}`,
        },
      ],
    ]
  }

  start = () => {
    return [
      [
        { text: '🖥️ Домены', callback_data: BotInline.websites },
        { text: '📜 Логи', callback_data: BotInline.logs },
       
      ],
      [
        { text: '🎛 Установочник', callback_data: BotInline.launcher },
      ],
      [{ text: '👤 Мой профиль', callback_data: BotInline.profile }],
      [{ text: '🛠️ Тех. Поддержка', url: this.config.TELEGRAM_SUPPORT }],
    ]
  }

  subdomainSetting = (id: number, subId: number, siteId: number | null) => {
    return [
      [
        {
          text: `${!siteId ? '❗️ ' : ''}🌐 Сайт`,
          callback_data: `${BotInline.site}_${subId}`,
        },
        { text: '📜 Логи', callback_data: `${BotInline.logs}_${subId}` },
      ],
      [
        {
          text: '⚠️ Удаление',
          callback_data: `${BotInline.subdomainDelete}_${subId}`,
        },
      ],
      [
        {
          text: '⬅️  Вернуться назад',
          callback_data: `${BotInline.websites}_${id}`,
        },
      ],
    ]
  }
  subdomainBack = (id: number) => {
    return [
      [
        {
          text: '⬅️  Вернуться назад',
          callback_data: `${BotInline.websites}_${id}`,
        },
      ],
    ]
  }
}
