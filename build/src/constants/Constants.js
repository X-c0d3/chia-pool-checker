"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const AppConfig = {
    PAGESIZE: process.env.PAGESIZE,
    API_URL: process.env.API_URL,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    ENABLE_LINE_NOTIFY: process.env.ENABLE_LINE_NOTIFY,
    LINE_TOKEN: process.env.LINE_TOKEN,
    CURRENCY: process.env.CURRENCY
};
exports.AppConfig = AppConfig;
