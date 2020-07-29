"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radiacion_model_1 = require("../models/radiacion.model");
const metodos_1 = __importDefault(require("../metodos"));
const userRoutes = express_1.Router();
var radio = 1;
var calendar = new Date();
var coordenadas = metodos_1.default.calcularCoordenadas(radio);
userRoutes.get('/prueba', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona bien!'
    });
});
userRoutes.post('/radio', (req, res, next) => {
    radio = req.body.dato;
    coordenadas = metodos_1.default.calcularCoordenadas(radio);
    try {
        res.json({
            ok: "true",
            radio
        });
    }
    catch (err) {
        next(err); // genera el error con un response
    }
});
userRoutes.get('/recientes', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                radiacion = metodos_1.default.marcadoresRecientes(radiacion);
                for (var marcador of radiacion) { // añadimos las coordenadas y el color para los poligonos de los marcadores mas recientes por cada sensor que haya funcionado ese dia presente
                    marcador.coordenadas = coordenadas;
                    marcador.color = metodos_1.default.escogerColor(marcador.uv);
                }
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.post('/radiacion', (req, res, next) => {
    calendar = req.body.calendar;
    var end = new Date(calendar); // obtenemos el dia, mes y anio del dia de hoy 
    end.setHours(19); // seteamos a 19 la hora debido a que es una hora posterior a las mediciones del dia del calendario seleccionado
    radiacion_model_1.Radiacion.find({ hora: { $gte: new Date(calendar), $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        // falta hacer un control de las muestras en la hora correcta
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                res.status(200).send({
                    radiacion
                });
            }
            else {
                res.status(200).send({
                    radiacion
                });
            }
        }
    });
});
userRoutes.get('/mes', (req, res, next) => {
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                radiacion = metodos_1.default.marcadoresMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.get('/maxmes', (req, res, next) => {
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                radiacion = metodos_1.default.maximoMes(radiacion);
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.get('/semanal', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy); // no restamos 1 a end debido a que el limite es el dia actual a las 0 para leer todas las fechas de ayer
    // end.setDate(end.getDate()-1); // es -1 xq necesitamos que el ultimo dia sea uno menos del actual
    start.setDate(start.getDate() - 30); // es -19 porque el chartjs solo permite mostrar 20 valores
    // console.log('start es:', start,' end es:', end);
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lte: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                radiacion = metodos_1.default.marcadoresSemanal(radiacion);
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.get('/maxsemanal', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy); // no restamos 1 a end debido a que el limite es el dia actual a las 0 para leer todas las fechas de ayer
    start.setDate(start.getDate() - 30); // restamos 30 porque queremos los 30 dias anteriores al actual
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            err.message = 'Error en el servidor';
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                radiacion = metodos_1.default.maximoSemana(radiacion);
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                next(err);
            }
        }
    });
});
userRoutes.post('/create', (req, res, next) => {
    const radiacion = {
        ubicacion: req.body.ubicacion,
        uv: req.body.uv,
        hora: req.body.hora,
        latitud: req.body.latitud,
        longitud: req.body.longitud
    };
    radiacion_model_1.Radiacion.create(radiacion).then(radiacionDB => {
        res.json({
            ok: true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
    }).catch(err => {
        next(err); // genera el error con un response
    });
});
exports.default = userRoutes;
