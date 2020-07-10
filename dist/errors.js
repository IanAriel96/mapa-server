"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_model_1 = require("./models/log.model");
var log;
var dia = new Date();
dia.setHours(dia.getHours() - 5);
function middleware(error, req, res, next) {
    res.json({
        status: 'error',
        name: error.name,
        message: error.message,
        date: Date(),
    });
    log = {
        nombre: error.name,
        mensaje: error.message,
        fecha: dia,
    };
    log_model_1.Log.create(log).then(logDB => {
        console.log('Se guardo con exito el log');
    }).catch(err => {
        next(err);
    });
}
;
module.exports = middleware;
