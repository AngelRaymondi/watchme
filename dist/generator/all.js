"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const facebook_1 = __importDefault(require("../facebook"));
const image_1 = __importDefault(require("../recognition/image"));
const comment_1 = require("./comment");
const random_1 = __importDefault(require("../util/random"));
const giphy_1 = __importDefault(require("./giphy"));
const submit_comment_1 = __importDefault(require("../submit-comment"));
const generate_all = async (url) => {
    const post = await facebook_1.default.get(url);
    let transcript = "";
    let recognition;
    if (post.attachment_type !== "NoAttachment") {
        try {
            recognition = await image_1.default.analize(post.attachment);
            transcript =
                "(" +
                    recognition.caption +
                    "; El texto que se puede reconocer de la imagen es: " +
                    recognition.text +
                    ")";
        }
        catch { }
    }
    const comment = await (0, comment_1.generate)(post.description, post.repost_text, `[${post.attachment_type}: ${post.attachment} ${transcript}]`);
    const search_gif = random_1.default.prob(3 / 8);
    let search;
    if (search_gif)
        search = await giphy_1.default.generate(post.description, comment);
    const comment_string = search_gif ? comment + '\n' + search.url : comment;
    await (0, submit_comment_1.default)(url, comment_string);
};
exports.default = { generate: generate_all };
