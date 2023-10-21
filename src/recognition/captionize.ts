import axios from "axios";
import cheerio from 'cheerio';
import FormData from "form-data";

const createAccessToken = async () => {
  const url = 'https://compressjpg.net/image-to-caption/';
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);
  const token = $('[name="csrfmiddlewaretoken"]').val();

  return token;
}

const captionize = async (image_url: string) => {
  const token = await createAccessToken();

  const form = new FormData({ encoding: 'multipart/form-data' });

  form.append('csrfmiddlewaretoken', token);
  form.append('image_url', image_url);

  const { data: { html } } = await axios
    .post("https://api.compressjpg.net/image-to-caption/", form, {
      headers: { "Content-Type": "multipart/form-data" }
    })

  const $ = cheerio.load(html);
  const caption = $('#share-myslider-container strong').text();

  return caption
}

export default captionize