import { GiphyFetch } from "@giphy/js-fetch-api";
import axios from "axios";
import dotenv from "dotenv";
import ask from './../util/chatgpt';

dotenv.config();

const { GIPHY_TOKEN } = process.env;
const giphy = new GiphyFetch(GIPHY_TOKEN);

const generate = async (description: string, comment: string) => {
  const query_ = await ask(
    `Hay una publicación de Facebook.
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

  return { url: gifs[0].url, intent: query_ } as { url: string, intent: string };
};

export default { generate };
