"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radiacion_model_1 = require("../models/radiacion.model");
const userRoutes = express_1.Router();
var poligono = new radiacion_model_1.Radiacion();
var err;
userRoutes.post('/createpoli', (req, res) => {
    const poligono = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    // then es de una promesa
    radiacion_model_1.Radiacion.create(poligono).then(radiacionDB => {
        res.json({
            ok: true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
    }).catch(err => {
        res.json({
            ok: false,
            err //envio el error
        });
    });
});
exports.default = userRoutes;
