"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    array: (array) => array[Math.floor(Math.random() * array.length)],
    number: (from, to) => {
        let n = Math.floor(Math.random() * (to + 1 - from) + from);
        return n;
    },
    prob: (fraction) => {
        let n = Math.floor(Math.random() * (100 + 1) + 0);
        return (fraction * 100) >= n;
    }
};
