"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// el model define el modelo o lo recupera, me ayuda a la interaccion con la BD
// el model me permite guardar el schema en una variable como en el ejemplo const Radiacion
const radiacionSchema = new mongoose_1.Schema({
    ubicacion: {
        type: String,
        required: [false, 'La ubicacion es necesaria']
    },
    uv: {
        type: Number,
        required: [true, 'La radiacion es necesaria']
    },
    hora: {
        type: Date,
        required: [false, 'La fecha es necesaria']
    },
    latitud: {
        type: Number,
        required: [false, 'La latitud es necesaria']
    },
    longitud: {
        type: Number,
        required: [false, 'La longitud es necesaria']
    },
    coordenadas: {
        type: Array,
        required: [false, 'Las coordenadas no son necesarias']
    },
    color: {
        type: String,
        required: [false, 'El color no es necesaria']
    }
});
exports.Radiacion = mongoose_1.model('Radiacion', radiacionSchema);
// la extension <IRadiacion> ayuda a la variable const Radiacion a mostrar que tiene los siguientes campos al poner un punto al momento de utilizarla
