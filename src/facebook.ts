import dotenv from "dotenv";
import cheerio from "cheerio";
import axios from "axios";
import image from "./recognition/image";

type AttachmentType =
  | "VideoAttachment"
  | "unknown"
  | "ImageAttachment"
  | "NoAttachment";

dotenv.config();

const { FACEBOOK_COOKIES } = process.env;

const get = async (fb_post_url: string) => {
  const { data: html } = await axios.get(fb_post_url, {
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
  });

  const $ = cheerio.load(html);

  const description = $($(".bj").toArray()[0]).text();

  const metadata = JSON.parse($('[id^="u_0_0"]').attr("data-ft") || "{}");
  let attachment_type: AttachmentType = <AttachmentType>{};
  let attachment: string = null;

  if (metadata.video_id) {
    attachment_type = "VideoAttachment";
    attachment = $('[id^="u_0"] img:not([width="16"])').attr("src");
  } else if ($('[id^="u_0"] img:not([width="16"])').attr("src")) {
    attachment_type = "ImageAttachment";
    attachment = $('[id^="u_0"] img:not([width="16"])').attr("src");
  } else {
    attachment_type = "NoAttachment";
  }

  const result = {
    description,
    repost_text: $($(".bj").toArray()[1]).text(),
    metadata, attachment,
    attachment_type
  };

  return result;
};

export default { get };