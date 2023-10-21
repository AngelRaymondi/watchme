import facebook from "../facebook";
import image from "../recognition/image";
import { generate } from "./comment";
import random from "../util/random";
import giphy from "./giphy";
import submit from "../submit-comment";

const generate_all = async (url: string) => {
  const post = await facebook.get(url);

  let transcript: any = "";
  let recognition: {
    text: string;
    caption: string;
  };


  if (post.attachment_type !== "NoAttachment") {
    try {
      recognition = await image.analize(post.attachment);
      transcript =
        "(" +
        recognition.caption +
        "; El texto que se puede reconocer de la imagen es: " +
        recognition.text +
        ")";
    } catch { }
  }

  const comment = await generate(
    post.description,
    post.repost_text,
    `[${post.attachment_type}: ${post.attachment} ${transcript}]`
  );

  const search_gif = random.prob(3 / 8);
  let search: {
    url: string;
    intent: string;
  };
  if (search_gif) search = await giphy.generate(post.description, comment);

  const comment_string = search_gif ? comment + '\n' + search.url : comment;

  await submit(url, comment_string);
}

export default { generate: generate_all }