"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
let UtilsService = class UtilsService {
    constructor() {
        this.date = (value) => {
            return value.toLocaleString("ru-RU", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
        };
        this.subdomain = (value) => {
            const regex = /^[a-zA-Z0-9\-_]+$/;
            return regex.test(value);
        };
    }
};
exports.UtilsService = UtilsService;
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
//# sourceMappingURL=utils.service.js.map