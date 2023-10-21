"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const createUserId = () => {
    let result = "";
    const length = 17;
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let i = 0;
    while (i < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        i++;
    }
    return result;
};
const ask = async (question) => {
    const { data: res } = await axios_1.default.get("https://untitled-turuuakzzz62.runkit.sh/chat", {
        params: {
            da: JSON.stringify({
                id: null,
                botId: "default",
                session: "N/A",
                clientId: createUserId(),
                contextId: 10,
                messages: [],
                newMessage: question,
                stream: false,
            }),
        },
    });
    return res.reply;
};
exports.default = ask;
