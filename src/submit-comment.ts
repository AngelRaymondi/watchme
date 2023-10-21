import cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const { FACEBOOK_COOKIES } = process.env;

const objectifyFormdata = (data: FormData) => {
  return data
    .getBuffer()
    .toString()
    .split(data.getBoundary())
    .filter((e) => e.includes("form-data"))
    .map((e) =>
      e
        .replace(/[\-]+$/g, "")
        .replace(/^[\-]+/g, "")
        .match(/\; name\=\"([^\"]+)\"(.*)/s)
        .filter((v, i) => i == 1 || i == 2)
        .map((e) => e.trim())
    )
    .reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {});
};

const submit = async (post_url: string, content: string) => {
  const { data: html } = await axios.get(post_url, {
    headers: {
      Cookie: FACEBOOK_COOKIES,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
    },
  });
  const $ = cheerio.load(html);

  const form_el = $('form[method="post"]');
  const fb_dtsg = $('[name="fb_dtsg"]').val();
  const jazoest = $('[name="jazoest"]').val();
  const send_comment_url = new URL(form_el.attr("action"), post_url).href;

  const comment_data = `fb_dtsg=${encodeURIComponent(
    fb_dtsg
  )}&jazoest=${encodeURIComponent(jazoest)}&comment_text=${encodeURIComponent(
    content
  )}`;

  const { data } = await axios.post(send_comment_url, comment_data, {
    headers: {
      Host: "mbasic.facebook.com",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      Referer:
        "https://mbasic.facebook.com/story.php?story_fbid=pfbid02bA5jV8MTS6PApoDLDfYfPx7XEFvfwdm3pHQW9P7c2tYBT5TqXZEBZn3yXWEcT2dal&id=100088768065531&eav=AfboVC3g-n_oZEg-LrFthy3yIBjRgdVtfhPBujqpsbtLgjW2ZoIMErKS2lmzw4uywso&paipv=0&_rdr",
      "Content-Type": "application/x-www-form-urlencoded",
      "Upgrade-Insecure-Requests": 1,
      Origin: "https://mbasic.facebook.com",
      DNT: 1,
      Connection: "keep-alive",
      Cookie:
        FACEBOOK_COOKIES,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      TE: "trailers",
    },
  });
};

export default submit;
