"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // express me permite crear un servidor web y tiene todo lo necesario para montar un servidor REST 
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
    }
    start() {
        this.app.listen(this.port, () => { console.log(`Servidor corriendo en el puerto ${this.port}`); });
    }
}
exports.default = Server;
