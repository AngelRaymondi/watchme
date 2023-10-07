"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const form_data_1 = __importDefault(require("form-data"));
const createAccessToken = async () => {
    const url = 'https://compressjpg.net/image-to-caption/';
    const { data: html } = await axios_1.default.get(url);
    const $ = cheerio_1.default.load(html);
    const token = $('[name="csrfmiddlewaretoken"]').val();
    return token;
};
const captionize = async (image_url) => {
    const token = await createAccessToken();
    const form = new form_data_1.default({ encoding: 'multipart/form-data' });
    form.append('csrfmiddlewaretoken', token);
    form.append('image_url', image_url);
    const { data: { html } } = await axios_1.default
        .post("https://api.compressjpg.net/image-to-caption/", form, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    const $ = cheerio_1.default.load(html);
    const caption = $('#share-myslider-container strong').text();
    return caption;
};
exports.default = captionize;
