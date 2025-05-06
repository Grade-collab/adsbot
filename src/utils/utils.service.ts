import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    date = (value: Date) => {
        return value.toLocaleString("ru-RU", {
            day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
        })
    }
    subdomain = (value: string) => {
        const regex = /^[a-zA-Z0-9\-_]+$/;
        return regex.test(value)
    }
}