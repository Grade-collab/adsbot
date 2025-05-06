import { Module } from "@nestjs/common";
import { HandleStart } from "./handle.start";
import { HandleProfile } from "./handle.profile";
import { HandleLogs } from "./handle.logs";
import { HandleWebSite } from "./handle.website";
import { HanldeSite } from "./handle.site";
import { HandleLaunch } from "./handle.launch";

const providers = [
    HandleStart,
    HandleProfile,
    HandleLogs,
    HandleWebSite,
    HanldeSite,
    HandleLaunch
]

@Module({
    providers,
    exports: providers
})
export class HandleModule {

}