import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import cheerio from "cheerio";
import { setTimeout as wait } from "timers/promises";
import all from "./generator/all";
import clc from "cli-color";

dotenv.config();

process.on("unhandledRejection", (e) => console.error(e));
process.on("uncaughtException", (e) => console.error(e));
process.on("uncaughtExceptionMonitor", (e) => console.error(e));

const { FACEBOOK_COOKIES, WATCH_FBID } = process.env;
const RECORD_PATH = "last_record";

console.log(clc.yellow("🎉 ¡WatchMe se ha iniciado correctamente!"));

const read_lr = () => fs.readFileSync(RECORD_PATH).toString();
const write_lr = (record: string) => fs.writeFileSync(RECORD_PATH, record);
const req_profile = async () =>
  (
    await axios.get("https://mbasic.facebook.com/profile.php", {
      params: {
        id: WATCH_FBID,
      },
      headers: {
        Cookie: FACEBOOK_COOKIES,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
        "Accept-Language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
      },
    })
  ).data;

if (!fs.existsSync(RECORD_PATH)) write_lr("");

(async () => {
  const check = async () => {
    const $ = cheerio.load(await req_profile());

    const last_comment_url = new URL(
      $(
        "[id^=u] > footer:nth-child(2) > div:nth-child(2) > a:nth-child(3)"
      ).attr("href"),
      "https://mbasic.facebook.com/"
    );
    const url_id = last_comment_url.searchParams.get("story_fbid");

    if (!read_lr().startsWith(url_id)) {
      console.log(clc.blue("👁️  Se ha encontrado una nueva publicación"));
      console.log(clc.blackBright(last_comment_url.href));

      all
        .generate(last_comment_url.href)
        .then(() =>
          console.log(
            clc.greenBright(
              "✅ ¡Se ha comentado en la publicación correctamente!"
            )
          )
        )
        .catch((e) => {
          console.error(e);
          console.error(
            clc.redBright(
              "❌ No se ha podido comentar en la publicación por un error inesperado"
            )
          );
        });

      write_lr(url_id);
    }

    // await wait(30 * 1000);
    await wait(60 * 1000);
    return check();
  };

  check();
})();
