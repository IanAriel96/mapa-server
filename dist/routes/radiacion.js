"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const radiacion_model_1 = require("../models/radiacion.model");
const metodos_1 = __importDefault(require("../metodos"));
const userRoutes = express_1.Router();
//var myDate = new Date("2019-12-2T01:00:00Z"); // para pruebas unicamente ya que en la bd puse muestras existentes para dias despues del actual osea hoy
// OJOOO SE QUEDA HOY CON EL VALOR QUEMADO EN CASO DE QUE EL USUARIO DEJE ABIERTA LA APP TODO EL DIA, NO SE ACTUALIZARA CON EL DIA ACTUAL
userRoutes.get('/recientes', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).sort({ hora: 1 }).exec((err, radiacion) => {
        //console.log('hoyees:', hoy);
        //Radiacion.find({hora:{$gt:new Date(hoy),$lt:new Date(myDate)}}).exec((err,radiacion)=>{
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
    // no quitamos este metodo calcularC y el radio = 1, debido a que en el metodo marcadoresRecientes llama a este metodo internamente
    // {hora:{$gt:new Date(hoy)}}
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).sort({ hora: 1 }).exec((err, radiacion) => {
        // falta hacer un control de las muestras en la hora correcta
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
userRoutes.get('/mes', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                radiacion = metodos_1.default.marcadoresMes(radiacion);
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
userRoutes.get('/maxmes', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                radiacion = metodos_1.default.maximoMes(radiacion);
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
userRoutes.get('/semanal', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 19); // es -19 porque el chartjs solo permite mostrar 20 valores
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                radiacion = metodos_1.default.marcadoresSemanal(radiacion);
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
userRoutes.get('/maxsemanal', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 19); // es -19 porque el chartjs solo permite mostrar 20 valores
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                radiacion = metodos_1.default.maximoSemana(radiacion);
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
userRoutes.get('/prueba', (req, res) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 19); // es -19 porque el chartjs solo permite mostrar 20 valores
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }
        else {
            if (radiacion) {
                // radiacion=Metodos.marcadoresSemanal(radiacion);
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
userRoutes.post('/crear', (req, res) => {
    const dato = {
        uv: req.body.uv,
    };
    // then es de una promesa
    radiacion_model_1.Radiacion.create(dato).then(radiacionDB => {
        res.json({
            ok: true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
        //console.log("se creo con exito el obj dato..");
    }).catch(err => {
        res.json({
            ok: false,
            err //envio el error
        });
        //console.log("Nooo se creo con exito el obj dato..");
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
        // console.log("se creo con exito el objetoo..");
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
