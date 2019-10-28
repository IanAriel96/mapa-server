"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// el model define el modelo o lo recupera, me ayuda a la interaccion con la BD
// el model me permite guardar el schema en una variable como en el ejemplo const Poligono
const poligonoSchema = new mongoose_1.Schema({
    path: {
        type: Array,
        required: [true, 'La ruta es necesaria']
    },
    color: {
        type: String,
        required: [true, 'El color es necesaria']
    }
});
exports.Poligono = mongoose_1.model('Poligono', poligonoSchema);
