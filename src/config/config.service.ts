import { Injectable } from '@nestjs/common'
import { config } from 'dotenv'

config()

@Injectable()
export class ConfigService {
  CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
  TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  TELEGRAM_SUPPORT = process.env.TELEGRAM_SUPPORT
  TELEGRAM_LOG = process.env.TELEGRAM_LOG
  APP_NAME = process.env.APP_NAME
  MINIO_HOST = process.env.MINIO_HOST
  MINIO_PORT = +process.env.MINIO_PORT
  MINIO_USER = process.env.MINIO_USER
  MINIO_PASSWORD = process.env.MINIO_PASSWORD
}
