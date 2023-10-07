"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tesseract_js_1 = require("tesseract.js");
const captionize_1 = __importDefault(require("./captionize"));
const translate = require("fix-esm").require("translate").default;
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
const GetURL = (input) => input.match(URL_REGEX)[0];
const analize = async (img_url) => {
    // const { data: buffer } = await axios.get(img_url, {
    //   responseType: "arraybuffer",
    // });
    // const img_base64 = "data:image/jpeg;base64," + buffer.toString("base64");
    // const { data: upload_img } = await axios.post(
    //   "https://www.astica.org/ajax/image.blob.upload.ajax.php",
    //   `blob=${encodeURIComponent(img_base64)}`
    // );
    // const url = GetURL(upload_img);
    // const { data: json } = await axios.post(
    //   `https://asticamv.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Description,Adult,Faces,Objects,Color,Tags,Brands&details=Landmarks,Celebrities&language=en`,
    //   {
    //     url,
    //   },
    //   {
    //     headers: {
    //       "Ocp-Apim-Subscription-Key": "498529a4ca974980b8e7c155e0b22c71",
    //     },
    //   }
    // );
    // const description__ = (
    //   await axios.post(
    //     "https://www.astica.org/ajax/nlp.submit.ajax.php",
    //     `task_pid=2&input=${encodeURIComponent(
    //       JSON.stringify(json) + "\r\nDescribe the image in detail:"
    //     )}&stop_sequence=&modelVersion=2.0&token_limit=700&temperature=0.7`
    //   )
    // ).data
    //   .replaceAll("{break_line}", "\n")
    //   .trim();
    const description__ = await (0, captionize_1.default)(img_url);
    const caption = await translate(description__, {
        from: "en",
        to: "es",
    });
    const worker = await (0, tesseract_js_1.createWorker)("spa");
    const { data: { text }, } = await worker.recognize(img_url);
    await worker.terminate();
    return { caption, text, };
};
exports.default = { analize };
