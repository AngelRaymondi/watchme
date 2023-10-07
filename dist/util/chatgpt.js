"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const createUserId = () => {
    let result = '';
    const length = 17;
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let i = 0;
    while (i < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        i++;
    }
    return result;
};
const ask = async (message) => {
    const { data: { id_: chat_id } } = await axios_1.default.post('https://chat.chatgptdemo.net/new_chat', {
        user_id: createUserId()
    });
    const CHAT_NAME_MAX_LENGTH = 15;
    const chat_name = message.length > (CHAT_NAME_MAX_LENGTH - 3) ? message.slice(0, CHAT_NAME_MAX_LENGTH - 3) + '...' : message;
    await axios_1.default.post('https://chat.chatgptdemo.net/update_chat_name', { chat_id, chat_name });
    const { data } = await axios_1.default.post('https://chat.chatgptdemo.net/chat_api_stream', { question: message, chat_id: chat_id, "timestamp": Date.now() });
    const json = data.split('data:').map((e) => e.trim()).slice(1);
    const end_line = json.findIndex((e) => e.endsWith(`"finish_reason":"stop"}]}`));
    const safe_chunks = json.slice(0, end_line).map((e) => JSON.parse(e).choices[0]);
    const reply = safe_chunks.map((e) => e.delta.content).join('').trim();
    return reply;
};
exports.default = ask;
