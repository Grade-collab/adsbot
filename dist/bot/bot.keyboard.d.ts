import { BotInline } from './bot.inline';
import { ConfigService } from 'src/config/config.service';
export declare class BotKeyboard {
    private readonly config;
    constructor(config: ConfigService);
    back: () => {
        text: string;
        callback_data: BotInline;
    }[][];
    subdomainSuccess: (id: number) => {
        text: string;
        callback_data: string;
    }[][];
    subdomainCancel: (id: number) => {
        text: string;
        callback_data: string;
    }[][];
    launcher: () => {
        text: string;
        callback_data: string;
    }[][];
    launcherCode: () => {
        text: string;
        callback_data: string;
    }[][];
    start: () => ({
        text: string;
        callback_data: BotInline;
    }[] | {
        text: string;
        url: string;
    }[])[];
    subdomainSetting: (id: number, subId: number, siteId: number | null) => {
        text: string;
        callback_data: string;
    }[][];
    subdomainBack: (id: number) => {
        text: string;
        callback_data: string;
    }[][];
}
