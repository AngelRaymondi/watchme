"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_color_1 = __importDefault(require("cli-color"));
const print = (input, no_color = false) => console.log(`${cli_color_1.default.yellow("[") + "👁️ " + cli_color_1.default.yellow("WatchMe]")} ${no_color ? input : cli_color_1.default.green(input)}`);
exports.default = print;
