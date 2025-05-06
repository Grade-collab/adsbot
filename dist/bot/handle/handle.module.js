"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleModule = void 0;
const common_1 = require("@nestjs/common");
const handle_start_1 = require("./handle.start");
const handle_profile_1 = require("./handle.profile");
const handle_logs_1 = require("./handle.logs");
const handle_website_1 = require("./handle.website");
const handle_site_1 = require("./handle.site");
const handle_launch_1 = require("./handle.launch");
const providers = [
    handle_start_1.HandleStart,
    handle_profile_1.HandleProfile,
    handle_logs_1.HandleLogs,
    handle_website_1.HandleWebSite,
    handle_site_1.HanldeSite,
    handle_launch_1.HandleLaunch
];
let HandleModule = class HandleModule {
};
exports.HandleModule = HandleModule;
exports.HandleModule = HandleModule = __decorate([
    (0, common_1.Module)({
        providers,
        exports: providers
    })
], HandleModule);
//# sourceMappingURL=handle.module.js.map