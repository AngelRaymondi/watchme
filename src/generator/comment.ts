import ask from './../util/chatgpt';
import fs from 'fs';

const prompt = (input: string, repost_text: string, data?: string) => {
  const prompt = fs.readFileSync('prompt.txt').toString()
    .replaceAll('#<post_content>', input)
    .replaceAll('#<repost_content>', repost_text)
    .replaceAll('#<attachment_content>', `${data || ''}`);


  return prompt
};

const generate = async (input: string, respost_text: string, data?: string) => {
  const description__ = await ask(prompt(input, respost_text, data));

  return description__
};

export { generate };
