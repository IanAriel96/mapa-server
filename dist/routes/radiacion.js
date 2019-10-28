"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radiacion_model_1 = require("../models/radiacion.model");
const metodos_1 = __importDefault(require("../metodos"));
const userRoutes = express_1.Router();
var hoy = new Date().toLocaleDateString(); // obtenemos el dia, mes y anio del dia de hoy 
userRoutes.get('/recientes', (req, res) => {
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).exec((err, radiacion) => {
        // gt es un operador para los valores mayores para nuestro ej todas las muestras del dia actual
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                radiacion = metodos_1.default.marcadoresRecientes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }
            else {
                res.status(404).send({
                    message: 'No hay radiaciones en la base'
                });
            }
        }
    });
});
userRoutes.get('/radiacion', (req, res) => {
    let radio = 1;
    let coordenadas = metodos_1.default.calcularCoordenadas(radio);
    // {hora:{$gt:new Date(hoy)}}
    radiacion_model_1.Radiacion.find({}).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                for (var marcador of radiacion) {
                    marcador.coordenadas = coordenadas;
                    marcador.color = metodos_1.default.escogerColor(marcador.uv);
                }
                res.status(200).send({
                    radiacion
                });
            }
            else {
                res.status(404).send({
                    message: 'No hay radiaciones'
                });
            }
        }
    });
});
userRoutes.post('/create', (req, res) => {
    const radiacion = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    // then es de una promesa
    radiacion_model_1.Radiacion.create(radiacion).then(radiacionDB => {
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
userRoutes.post('/update', (req, res) => {
    const radiacion = {
        uv: req.body.uv,
        hora: req.body.hora
    };
    radiacion_model_1.Radiacion.findByIdAndUpdate("5d82636976ddcb3ea0ead737", radiacion, { new: false }, (err, radiacionDB) => {
        if (err)
            throw err;
        if (!radiacionDB) {
            return res.json({
                ok: false,
                mensaje: 'No exsite esa radiacion con ese ID'
            });
        }
        res.json({
            ok: true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
    });
});
exports.default = userRoutes;
