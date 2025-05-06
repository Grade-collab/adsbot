import { Global, Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";

const providers = [UtilsService]

@Global()
@Module({
    providers,
    exports: providers
})
export class UtilsModule {

}