"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importStar(require("fs"));
const cheerio_1 = __importDefault(require("cheerio"));
const promises_1 = require("timers/promises");
const all_1 = __importDefault(require("./generator/all"));
const cli_color_1 = __importDefault(require("cli-color"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
process.on("unhandledRejection", (e) => console.error(e));
process.on("uncaughtException", (e) => console.error(e));
process.on("uncaughtExceptionMonitor", (e) => console.error(e));
const { FACEBOOK_COOKIES, WATCH_FBID, FACEBOOK_USERNAME } = process.env;
const RECORD_PATH = "last_record";
if (!FACEBOOK_COOKIES || !WATCH_FBID || !FACEBOOK_USERNAME) {
    console.log(cli_color_1.default.bgRedBright(`❌ Alguna(s) variables de entorno no están configuradas correctamente`));
    console.log(cli_color_1.default.redBright(`Cerrando el proceso...`));
}
const successfully_started = () => console.log(cli_color_1.default.yellow("🎉 ¡WatchMe se ha iniciado correctamente!"));
const read_lr = () => fs_1.default.readFileSync(RECORD_PATH).toString();
const write_lr = (record) => fs_1.default.writeFileSync(RECORD_PATH, record);
const headers = {
    Cookie: FACEBOOK_COOKIES,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
    "Accept-Language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
};
const req_profile = async () => (await axios_1.default.get("https://mbasic.facebook.com/profile.php", {
    params: {
        id: WATCH_FBID,
    },
    headers,
})).data;
if (!fs_1.default.existsSync(RECORD_PATH))
    write_lr("");
let started = false;
const start = () => {
    started = true;
    successfully_started();
    const check = async () => {
        const $ = cheerio_1.default.load(await req_profile());
        const last_comment_url = new URL($("[id^=u] > footer:nth-child(2) > div:nth-child(2) > a:nth-child(3)").attr("href"), "https://mbasic.facebook.com/");
        const url_id = last_comment_url.searchParams.get("story_fbid");
        if (read_lr() !== url_id) {
            const { data } = await axios_1.default.get(last_comment_url.href, { headers });
            (0, fs_1.writeFileSync)("a", data);
            const $ = cheerio_1.default.load(data);
            const names = $("#add_comment_switcher_placeholder ~ div ~ div h3")
                .toArray()
                .map((e) => $(e).text());
            if (names.includes(FACEBOOK_USERNAME)) {
                write_lr(url_id);
            }
            else {
                console.log(cli_color_1.default.blue("👁️  Se ha encontrado una nueva publicación"));
                console.log(cli_color_1.default.blackBright(last_comment_url.href));
                all_1.default
                    .generate(last_comment_url.href)
                    .then(() => console.log(cli_color_1.default.greenBright("✅ ¡Se ha comentado en la publicación correctamente!")))
                    .catch((e) => {
                    console.error(e);
                    console.error(cli_color_1.default.redBright("❌ No se ha podido comentar en la publicación por un error inesperado"));
                });
                write_lr(url_id);
            }
            // await wait(30 * 1000);
            await (0, promises_1.setTimeout)(30 * 60 * 1000);
            return check();
        }
    };
    check();
};
if (!process.env.DEV) {
    const app = (0, express_1.default)();
    app.get("/", (_req, res) => res.sendStatus(200));
    app.get("/watchme", (_req, res) => {
        if (!started)
            start();
        res.sendStatus(200);
    });
    app.listen(process.env.PORT || 1432, () => {
        console.log(cli_color_1.default.blackBright("Esperando [GET] /watchme"));
    });
}
else {
    start();
}
