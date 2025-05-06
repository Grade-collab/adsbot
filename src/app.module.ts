import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { CloudflareModule } from './cf/cf.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BotModule } from './bot/bot.module';
import { UtilsModule } from './utils/utils.module';
import { LogModule } from './log/log.module';
import { MinioModule } from './minio/minio.module';
import { ParseModule } from './parse/parse.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    CloudflareModule,
    ScheduleModule.forRoot(),
    BotModule,
    UtilsModule,
    LogModule,
    MinioModule,
    ParseModule
  ],
})
export class AppModule { }
