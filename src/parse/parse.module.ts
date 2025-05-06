import { Global, Module } from "@nestjs/common";
import { ParseService } from "./parse.service";
import { ParseController } from "./parse.controller";

const providers = [
    ParseService
]

@Global()
@Module({
    providers,
    exports: providers,
    controllers: [
        ParseController
    ]
})
export class ParseModule {

}