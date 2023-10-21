"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const cheerio_1 = __importDefault(require("cheerio"));
const promises_1 = require("timers/promises");
const all_1 = __importDefault(require("./generator/all"));
const cli_color_1 = __importDefault(require("cli-color"));
dotenv_1.default.config();
process.on("unhandledRejection", (e) => console.error(e));
process.on("uncaughtException", (e) => console.error(e));
process.on("uncaughtExceptionMonitor", (e) => console.error(e));
const { FACEBOOK_COOKIES, WATCH_FBID } = process.env;
const RECORD_PATH = "last_record";
console.log(cli_color_1.default.yellow("🎉 ¡WatchMe se ha iniciado correctamente!"));
const read_lr = () => fs_1.default.readFileSync(RECORD_PATH).toString();
const write_lr = (record) => fs_1.default.writeFileSync(RECORD_PATH, record);
const req_profile = async () => (await axios_1.default.get("https://mbasic.facebook.com/profile.php", {
    params: {
        id: WATCH_FBID,
    },
    headers: {
        Cookie: FACEBOOK_COOKIES,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        "Accept-Language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
    },
})).data;
if (!fs_1.default.existsSync(RECORD_PATH))
    write_lr("");
(async () => {
    const check = async () => {
        const $ = cheerio_1.default.load(await req_profile());
        const last_comment_url = new URL($("[id^=u] > footer:nth-child(2) > div:nth-child(2) > a:nth-child(3)").attr("href"), "https://mbasic.facebook.com/");
        const url_id = last_comment_url.searchParams.get("story_fbid");
        if (!read_lr().startsWith(url_id)) {
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
    };
    check();
})();
