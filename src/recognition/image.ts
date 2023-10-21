import axios from "axios";
import { createWorker } from "tesseract.js";
import captionize from "./captionize";

export interface Recognition {
  categories: Category[];
  adult: Adult;
  color: Color;
  tags: Tag[];
  description: Description;
  faces: any[];
  objects: Object[];
  brands: Brand[];
  requestId: string;
  metadata: Metadata;
  modelVersion: string;
}

export interface Adult {
  isAdultContent: boolean;
  isRacyContent: boolean;
  isGoryContent: boolean;
  adultScore: number;
  racyScore: number;
  goreScore: number;
}

export interface Brand {
  name: string;
  confidence: number;
  rectangle: Rectangle;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Category {
  name: string;
  score: number;
}

export interface Color {
  dominantColorForeground: string;
  dominantColorBackground: string;
  dominantColors: string[];
  accentColor: string;
  isBwImg: boolean;
  isBWImg: boolean;
}

export interface Description {
  tags: string[];
  captions: Caption[];
}

export interface Caption {
  text: string;
  confidence: number;
}

export interface Metadata {
  height: number;
  width: number;
  format: string;
}

export interface Object {
  rectangle: Rectangle;
  object: string;
  confidence: number;
}

export interface Tag {
  name: string;
  confidence: number;
}

const translate = require("fix-esm").require("translate").default;
const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
const GetURL = (input: string) => input.match(URL_REGEX)[0];

const analize = async (img_url: string) => {
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

  const description__ = await captionize(img_url);

  const caption: string = await translate(description__, {
    from: "en",
    to: "es",
  });

  const worker = await createWorker("spa");
  const {
    data: { text },
  } = await worker.recognize(img_url);
  await worker.terminate();

  return { caption, text, } as { caption: string, text: string };
};

export default { analize };
