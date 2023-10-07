"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const chatgpt_1 = __importDefault(require("./../util/chatgpt"));
const fs_1 = __importDefault(require("fs"));
const translate = require("fix-esm").require("translate").default;
const prompt = (input, repost_text, data) => {
    const prompt = fs_1.default.readFileSync('prompt.txt').toString()
        .replaceAll('#<post_content>', input)
        .replaceAll('#<repost_content>', repost_text)
        .replaceAll('#<attachment_content>', `${data || ''}`);
    return prompt;
};
const generate = async (input, respost_text, data) => {
    const description__ = await (0, chatgpt_1.default)(prompt(input, respost_text, data));
    return description__;
};
exports.generate = generate;
