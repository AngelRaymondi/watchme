"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_fetch_api_1 = require("@giphy/js-fetch-api");
const dotenv_1 = __importDefault(require("dotenv"));
const chatgpt_1 = __importDefault(require("./../util/chatgpt"));
dotenv_1.default.config();
const { GIPHY_TOKEN } = process.env;
const giphy = new js_fetch_api_1.GiphyFetch(GIPHY_TOKEN);
const generate = async (description, comment) => {
    const query_ = await (0, chatgpt_1.default)(`Hay una publicación de Facebook de Alberto Ruiz Egoavil(Tu profesor).
  La publicación dice ${description || '[No dice nada]'}.
  Y tu comentario dice ${comment}.
  SOLO ESCRIBE UNA palabra que describa ese comentario junto con el contexto de la publicación.
  RECUERDA, SOLO DIME UNA SOLA PALABRA.
  OBLIGATORIO: ENVIA SOLO UNA PALABRA`);
    const { data: gifs } = await giphy.search(query_, {
        limit: 1,
        lang: "es",
        rating: "g",
        sort: "relevant",
    });
    return { url: gifs[0].url, intent: query_ };
};
exports.default = { generate };
