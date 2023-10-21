// import facebook from "./facebook";
// import { generate } from "./generator/comment";
// import giphy from "./generator/giphy";
// import image, { Recognition } from "./recognition/image";
// import clc from "cli-color";
// import submit from "./submit-comment";
// import print from "./util/print";
// import random from "./util/random";

// (async () => {
//   const url =
//     "https://mbasic.facebook.com/story.php?story_fbid=pfbid032FxwhYCiQbvmXGhJ9qdJoKNZBLpKP1RJ8uDMqWWfQjZEqHRUyUEp4Hmp81qDsRF3l&id=100088768065531&eav=AfbyWxA9SlZlHv5P9SiV2CI5z2Y53Q51pcWMNMrTGT4nKDz_YB7Htjq5iSeYI_d3TIQ&refid=17&__tn__=%2AW-R&paipv=0";

//   const post = await facebook.get(url);

//   let transcript: any = "";
//   let recognition: {
//     text: string;
//     caption: string;
//   };

//   print("Se inició correctamente");

//   if (post.attachment_type !== "NoAttachment") {
//     try {
//       recognition = await image.analize(post.attachment);
//       transcript =
//         "(" +
//         recognition.caption +
//         "; El texto que se puede reconocer de la imágen es: " +
//         recognition.text +
//         ")";
//     } catch { }
//   }

//   const comment = await generate(
//     post.description,
//     `[${post.attachment_type}: ${post.attachment};${transcript}]`
//   );

//   const search_gif = random.prob(3 / 8);
//   let search: {
//     url: string;
//     intent: string;
//   };
//   if (search_gif) search = await giphy.generate(post.description, comment);

//   const comment_string = search_gif ? comment + '\n' + search.url : comment;

//   await submit(url, comment_string);

//   if (recognition) {
//     console.log(clc.cyan(`DESCRIPCIÓN DE LA IMAGEN`));
//     console.log(clc.yellow("Corta"));
//     console.log(recognition.caption);
//     // console.log(clc.yellow("Larga"));
//     // console.log(recognition.description);
//   }

//   console.log(clc.cyan("COMENTARIO"));
//   console.log(comment_string);

//   if (search_gif) {
//     console.log(clc.cyan("DATOS DEL GIF"), '-', clc.green('Activado'));
//     console.log(`Búsqueda:`, clc.yellow(search.intent));
//     console.log(`URL:`, search.url);
//   } else {
//     console.log(clc.cyan("DATOS DEL GIF"), '-', clc.red('Desactivado'));
//     console.log(`Búsqueda:`, clc.blackBright('-----'));
//     console.log(`URL:`, clc.blackBright('-----'));
//   }
// })();
