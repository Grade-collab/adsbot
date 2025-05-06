import { Global, Module } from "@nestjs/common";
import { CloudflareService } from "./cf.service";

const providers = [CloudflareService]
@Global()
@Module({
    providers,
    exports: providers
})
export class CloudflareModule {

}