import { Global, Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { HandleModule } from "./handle/handle.module";
import { BotEffect } from "./bot.effect";
import { BotKeyboard } from "./bot.keyboard";

const providers = [
    BotService,
    BotEffect,
    BotKeyboard
]
@Global()
@Module({
    providers,
    exports: providers,
    imports: [
        HandleModule
    ]
})
export class BotModule {

}