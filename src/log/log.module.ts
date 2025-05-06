import { Module } from "@nestjs/common";
import { LogService } from "./log.service";
import { LogController } from "./log.controller";

const providers = [
    LogService
]

@Module({
    providers,
    exports: providers,
    controllers: [
        LogController
    ]
})
export class LogModule {

}