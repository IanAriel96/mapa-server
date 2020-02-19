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
var coordenadas = metodos_1.default.calcularCoordenadas(radio);
var errores = [];
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
        var error = {
            status: 'error',
            name: err.name,
            message: err.message,
            date: Date(),
        };
        errores.push(error);
        next(err); // genera el error con un response
    }
});
//var myDate = new Date("2019-12-2T01:00:00Z"); // para pruebas unicamente ya que en la bd puse muestras existentes para dias despues del actual osea hoy
// OJOOO SE QUEDA HOY CON EL VALOR QUEMADO EN CASO DE QUE EL USUARIO DEJE ABIERTA LA APP TODO EL DIA, NO SE ACTUALIZARA CON EL DIA ACTUAL
userRoutes.get('/recientes', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    //abc();
    // console.log(errorMiddleware);
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).sort({ hora: 1 }).exec((err, radiacion) => {
        //console.log('hoyees:', hoy);
        //Radiacion.find({hora:{$gt:new Date(hoy),$lt:new Date(myDate)}}).exec((err,radiacion)=>{
        // gt es un operador para los valores mayores para nuestro ej todas las muestras del dia actual
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
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
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/radiacion', (req, res, next) => {
    // let radio = 1 ; 
    // let coordenadas: number[] = Metodos.calcularCoordenadas(radio); 
    // no quitamos este metodo calcularC y el radio = 1, debido a que en el metodo marcadoresRecientes llama a este metodo internamente
    // {hora:{$gt:new Date(hoy)}}
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find({ hora: { $gt: new Date(hoy) } }).sort({ hora: 1 }).exec((err, radiacion) => {
        // falta hacer un control de las muestras en la hora correcta
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
            next(err);
        }
        else {
            if (Object.keys(radiacion).length !== 0) {
                res.status(200).send({
                    radiacion
                });
            }
            else {
                var err = new Error('No hay muestras en la base');
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/mes', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
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
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/maxmes', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    radiacion_model_1.Radiacion.find().sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
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
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/semanal', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 19); // es -19 porque el chartjs solo permite mostrar 20 valores
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
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
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/maxsemanal', (req, res, next) => {
    var hoy = new Date(); // obtenemos el dia, mes y anio del dia de hoy 
    hoy.setHours(0); // seteamos a 0 la hora debido a que nos interesa obtener todas las muestras del dia actual desde las 5 am (5 horas agregadas provocada por el ajuste de zona horaria que tenemos en el computador GMT-5)
    let start = new Date(hoy);
    let end = new Date(hoy);
    end.setDate(end.getDate() + 1);
    start.setDate(start.getDate() - 19); // es -19 porque el chartjs solo permite mostrar 20 valores
    radiacion_model_1.Radiacion.find({ hora: { $gte: start, $lt: end } }).sort({ hora: 1 }).exec((err, radiacion) => {
        if (err) {
            var error = {
                status: 'error',
                name: err.name,
                message: 'Error en el servidor',
                date: Date(),
            };
            errores.push(error);
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
                var error = {
                    status: 'error',
                    name: err.name,
                    message: err.message,
                    date: Date(),
                };
                errores.push(error);
                next(err);
            }
        }
    });
});
userRoutes.get('/errores', (req, res, next) => {
    errores;
    try {
        res.json({
            lista: errores,
        });
    }
    catch (err) {
        var error = {
            status: 'error',
            name: err.name,
            message: err.message,
            date: Date(),
        };
        errores.push(error);
        next(err); // genera el error con un response
    }
});
userRoutes.get('/limpiar', (req, res, next) => {
    errores = [];
    try {
        res.json({
            lista: errores,
        });
    }
    catch (err) {
        var error = {
            status: 'error',
            name: err.name,
            message: err.message,
            date: Date(),
        };
        errores.push(error);
        next(err); // genera el error con un response
    }
});
userRoutes.post('/crear', (req, res) => {
    const dato = {
        uv: req.body.uv,
    };
    res.json({
        ok: true,
        uv: dato.uv,
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
    // radiacion.hora.setHours(radiacion.hora.getHours()-5);
    // then es de una promesa
    radiacion_model_1.Radiacion.create(radiacion).then(radiacionDB => {
        res.json({
            ok: true,
            radiacion: radiacionDB // muestro el item radiacion creado al postman para decir q fue un exito
        });
        // console.log("se creo con exito el objetoo..");
    }).catch(err => {
        var error = {
            status: 'error',
            name: err.name,
            message: err.message,
            date: Date(),
        };
        errores.push(error);
        next(err); // genera el error con un response
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
