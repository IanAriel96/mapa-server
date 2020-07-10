"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_model_1 = require("../models/log.model");
const logRoutes = express_1.Router();
logRoutes.get('/errores', (req, res, next) => {
    log_model_1.Log.find({}).exec((err, log) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(log).length !== 0) {
                res.status(200).send({
                    log
                });
            }
            else {
                res.status(200).send({
                    log: []
                });
            }
        }
    });
});
logRoutes.get('/limpiar', (req, res, next) => {
    const todos = { "nombre": /$/ };
    log_model_1.Log.remove(todos).exec((err, log) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (log.n !== 0) {
                res.status(200).send({
                    log: []
                });
            }
            else {
                res.status(200).send({
                    log: [],
                    mensaje: 'no existe documentos en la coleccion'
                });
            }
        }
    });
});
exports.default = logRoutes;
